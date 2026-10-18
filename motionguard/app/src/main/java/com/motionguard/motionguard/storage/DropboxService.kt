package com.motionguard.app.storage

import android.content.Context
import com.dropbox.core.v2.DbxClientV2
import com.dropbox.core.v2.files.FolderMetadata
import com.dropbox.core.v2.files.ListFolderResult
import com.dropbox.core.v2.files.Metadata
import com.dropbox.core.v2.sharing.SharingDbxClientV2
import java.io.File
import java.util.*

/**
 * Dropbox storage implementation using Dropbox Java SDK v2.
 */
class DropboxService(
    private val context: Context,
    private val appKey: String
) : CloudStorageService {

    override val provider = CloudProvider.DROPBOX

    private var client: DbxClientV2? = null
    private var accessToken: String? = null

    override fun isAuthenticated(): Boolean = client != null && accessToken != null

    override suspend fun authenticate(): Boolean {
        return try {
            // Authentication handled via OAuth intent; token stored via setAccessToken
            accessToken?.let {
                client = createClient(it)
                true
            } ?: false
        } catch (e: Exception) {
            false
        }
    }

    private fun createClient(token: String): DbxClientV2 {
        val request = com.dropbox.core.DbxRequestConfig("MotionGuard/1.0")
        return DbxClientV2(request, token)
    }

    fun setAccessToken(token: String) {
        this.accessToken = token
        this.client = createClient(token)
    }

    override suspend fun signOut() {
        client = null
        accessToken = null
    }

    override suspend fun uploadFile(
        localFile: File,
        remoteFileName: String,
        onProgress: (Float) -> Unit
    ): UploadResult {
        val currentClient = client ?: return UploadResult(success = false, error = "Not authenticated")
        return try {
            val remotePath = "/MotionGuard/$remoteFileName"
            val filesClient = currentClient.filesClient
            java.io.FileInputStream(localFile).use { input ->
                val upload = filesClient.uploadSessionStart(input)
                val cursor = com.dropbox.core.v2.files.UploadSessionCursor(
                    upload.getOffset(), upload.getCursor().getSeq()
                )
                val commit = com.dropbox.core.v2.files.CommitInfo(
                    remotePath,
                    com.dropbox.core.v2.files.WriteMode.OVERWRITE
                )
                filesClient.uploadSessionFinish(input, cursor, commit)
            }
            onProgress(1.0f)
            UploadResult(success = true, remoteId = remotePath)
        } catch (e: Exception) {
            UploadResult(success = false, error = e.message)
        }
    }

    override suspend fun getQuota(): StorageQuota? {
        val currentClient = client ?: return null
        return try {
            val response = currentClient.usersClient.getSpaceUsage
            // Space usage info
            StorageQuota(
                usedBytes = response.usageInBytes,
                totalBytes = response.allocation.allocated,
                availableBytes = response.allocation.allocated - response.usageInBytes
            )
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun listFiles(): List<RemoteFile> {
        val currentClient = client ?: return emptyList()
        return try {
            val result: ListFolderResult = currentClient.filesClient.listFolder("/MotionGuard")
            result.entries.map { metadata ->
                RemoteFile(
                    id = metadata.pathLower ?: "",
                    name = metadata.name,
                    sizeBytes = (metadata as? com.dropbox.core.v2.files.FileMetadata)?.size ?: 0L,
                    modifiedDate = (metadata as? com.dropbox.core.v2.files.FileMetadata)?.serverModified?.let { Date.from(it.toInstant()) } ?: Date(),
                    mimeType = "",
                    downloadUrl = metadata.pathDisplay
                )
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    override suspend fun deleteFile(remoteId: String): Boolean {
        val currentClient = client ?: return false
        return try {
            currentClient.filesClient.deleteV2(remoteId)
            true
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun getShareableUrl(remoteId: String): String? {
        val currentClient = client ?: return null
        return try {
            val sharingClient = SharingDbxClientV2(currentClient.authToken, currentClient.requestConfig)
            val sharedLink = sharingClient.createSharedLinkWithPending(remoteId)
            sharedLink.url
        } catch (e: Exception) {
            null
        }
    }
}