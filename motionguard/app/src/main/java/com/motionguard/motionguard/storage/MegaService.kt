package com.motionguard.app.storage

import android.content.Context
import nz.mega.sdk.MegaApiAndroid
import nz.mega.sdk.MegaError
import nz.mega.sdk.MegaRequest
import nz.mega.sdk.MegaShare
import java.io.File
import java.util.*

/**
 * MEGA storage implementation using MEGA SDK.
 */
class MegaService(
    private val context: Context,
    private val appKey: String
) : CloudStorageService {

    override val provider = CloudProvider.MEGA

    private var megaApi: MegaApiAndroid? = null
    private var authenticated = false
    private var email: String? = null

    init {
        try {
            megaApi = MegaApiAndroid(context, appKey)
            megaApi?.let { api ->
                api.retryDownloads = true
                api.retryUploads = true
            }
        } catch (e: Exception) {
            megaApi = null
        }
    }

    override fun isAuthenticated(): Boolean = authenticated

    override suspend fun authenticate(): Boolean {
        return false // MEGA login handled via UI login activity
    }

    fun setSession(session: String) {
        // Restore session
        megaApi?.let {
            it.importSession(session)
            authenticated = true
        }
    }

    override suspend fun signOut() {
        megaApi?.logout()
        authenticated = false
        email = null
    }

    override suspend fun uploadFile(
        localFile: File,
        remoteFileName: String,
        onProgress: (Float) -> Unit
    ): UploadResult {
        val api = megaApi ?: return UploadResult(success = false, error = "MEGA not initialized")
        return try {
            val parent = api.getRootNode()
            val uploadPath = "/MotionGuard/$remoteFileName"
            val listener = object : MegaRequest {
                override fun onRequestFinish(api: MegaApiAndroid, request: MegaRequest, e: MegaError) {
                    if (e.errorCode == MegaError.API_OK) {
                        onProgress(1.0f)
                    }
                }
                override fun onRequestUpdate(api: MegaApiAndroid, request: MegaRequest) {
                    onProgress(request.getTransferredBytes.toFloat() / request.getTotalBytes())
                }
                override fun onRequestTemporaryError(api: MegaApiAndroid, request: MegaRequest, e: MegaError) {}
            }
            api.uploadFile(localFile.absolutePath, parent, remoteFileName, -1, listener)
            UploadResult(success = true, remoteId = uploadPath)
        } catch (e: Exception) {
            UploadResult(success = false, error = e.message)
        }
    }

    override suspend fun getQuota(): StorageQuota? {
        val api = megaApi ?: return null
        return try {
            val quota = api.getQuota()
            val total = quota.quotaBytes
            val used = quota.usedBytes
            StorageQuota(
                usedBytes = used,
                totalBytes = total,
                availableBytes = total - used
            )
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun listFiles(): List<RemoteFile> {
        val api = megaApi ?: return emptyList()
        return try {
            val folder = api.getRootNode()
            val children = api.getChildren(folder)
            children.map { node ->
                RemoteFile(
                    id = node.handle,
                    name = node.name,
                    sizeBytes = node.size,
                    modifiedDate = Date(node.modificationTime),
                    mimeType = "",
                    downloadUrl = ""
                )
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    override suspend fun deleteFile(remoteId: String): Boolean {
        val api = megaApi ?: return false
        return try {
            val node = api.getNodeByHandle(remoteId.toLong())
            api.remove(node, false)
            true
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun getShareableUrl(remoteId: String): String? {
        val api = megaApi ?: return null
        return try {
            val node = api.getNodeByHandle(remoteId.toLong())
            val share = api.getShareByHandle(remoteId.toLong())
            share?.link
        } catch (e: Exception) {
            null
        }
    }
}