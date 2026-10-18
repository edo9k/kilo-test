package com.motionguard.app.storage

import android.content.Context
import com.microsoft.identity.client.PublicClientApplication
import com.microsoft.identity.client SilentAuthenticationResult
import com.microsoft.identity.client.AuthenticationResult
import com.microsoft.identity.client.IAuthenticationResult
import com.microsoft.identity.client.IPublicClientApplication
import com.microsoft.identity.client.IPublicClientApplication.LoginCallback
import com.microsoft.identity.client.exceptions.MsalException
import retrofit2.Call
import retrofit2.Response
import java.io.File
import java.util.*

/**
 * Microsoft OneDrive storage implementation using MSAL + Graph API.
 */
class OneDriveService(
    private val context: Context,
    private val clientId: String
) : CloudStorageService {

    override val provider = CloudProvider.ONE_DRIVE

    private var pca: IPublicClientApplication? = null
    private var accessToken: String? = null

    init {
        try {
            pca = PublicClientApplication.create(context, clientId)
        } catch (e: MsalException) {
            pca = null
        }
    }

    override fun isAuthenticated(): Boolean = accessToken != null

    override suspend fun authenticate(): Boolean {
        return try {
            val result = suspendCoroutine<IAuthenticationResult?> { cont ->
                val localPca = pca ?: run { cont.resume(null); return@suspendCoroutine }
                localPca.acquireTokenInteractive(
                    listOf("Files.ReadWrite.AppFolder", "offline_access", "User.Read")
                )
                    .run {
                        cont.resume(this)
                    }
            }
            result != null
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun signOut() {
        accessToken = null
        pca?.getApplication()?.signOut()
    }

    private suspend fun ensureAuthenticated(): String? {
        if (accessToken != null) return accessToken
        return if (authenticate()) accessToken else null
    }

    override suspend fun uploadFile(
        localFile: File,
        remoteFileName: String,
        onProgress: (Float) -> Unit
    ): UploadResult {
        val token = ensureAuthenticated() ?: return UploadResult(success = false, error = "Not authenticated")
        return try {
            val api = OneDriveApi.create(token)
            val response = api.uploadFile(remoteFileName, localFile).execute()
            onProgress(1.0f)
            if (response.isSuccessful) {
                val body = response.body()
                UploadResult(
                    success = true,
                    remoteId = body?.id,
                    remoteUrl = body?.webUrl
                )
            } else {
                UploadResult(success = false, error = response.message())
            }
        } catch (e: Exception) {
            UploadResult(success = false, error = e.message)
        }
    }

    override suspend fun getQuota(): StorageQuota? {
        val token = ensureAuthenticated() ?: return null
        return try {
            val api = OneDriveApi.create(token)
            val response = api.getDriveInfo().execute()
            if (response.isSuccessful) {
                val body = response.body()
                StorageQuota(
                    usedBytes = body?.usageBytes ?: 0,
                    totalBytes = body?.totalBytes ?: 0,
                    availableBytes = body?.availableBytes ?: 0
                )
            } else null
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun listFiles(): List<RemoteFile> {
        val token = ensureAuthenticated() ?: return emptyList()
        return try {
            val api = OneDriveApi.create(token)
            val response = api.listDriveItems().execute()
            if (response.isSuccessful) {
                response.body()?.value?.map {
                    RemoteFile(
                        id = it.id,
                        name = it.name,
                        sizeBytes = it.size,
                        modifiedDate = it.modifiedTime?.let { d -> Date.from(d.toInstant()) } ?: Date(),
                        mimeType = it.file?.mimeType ?: "",
                        downloadUrl = it.downloadUrl
                    )
                } ?: emptyList()
            } else emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    override suspend fun deleteFile(remoteId: String): Boolean {
        val token = ensureAuthenticated() ?: return false
        return try {
            val api = OneDriveApi.create(token)
            api.deleteItem(remoteId).execute()
            true
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun getShareableUrl(remoteId: String): String? {
        val token = ensureAuthenticated() ?: return null
        return try {
            val api = OneDriveApi.create(token)
            val response = api.createShareLink(remoteId, "view").execute()
            if (response.isSuccessful) response.body()?.link?.webUrl else null
        } catch (e: Exception) {
            null
        }
    }
}