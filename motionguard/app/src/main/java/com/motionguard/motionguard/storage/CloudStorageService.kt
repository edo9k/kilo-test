package com.motionguard.app.storage

import android.content.Context
import android.net.Uri
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizeRequest
import com.google.api.services.drive.model.File
import com.google.api.services.drive.model.FileList
import java.io.File
import java.util.*

/**
 * Abstraction layer for cloud storage providers.
 * Each provider implements this interface to upload videos.
 */
interface CloudStorageService {
    val provider: CloudProvider

    /** Check if user is authenticated */
    fun isAuthenticated(): Boolean

    /** Start authentication flow. Returns true on success. */
    suspend fun authenticate(): Boolean

    /** Sign out / disconnect */
    suspend fun signOut()

    /** Upload a file. Returns remote file ID on success. */
    suspend fun uploadFile(
        localFile: File,
        remoteFileName: String,
        onProgress: (Float) -> Unit = {}
    ): UploadResult

    /** Get storage quota info */
    suspend fun getQuota(): StorageQuota?

    /** List files in app folder */
    suspend fun listFiles(): List<RemoteFile>

    /** Delete a remote file */
    suspend fun deleteFile(remoteId: String): Boolean

    /** Get a shareable URL for a remote file */
    suspend fun getShareableUrl(remoteId: String): String?
}

data class UploadResult(
    val success: Boolean,
    val remoteId: String? = null,
    val remoteUrl: String? = null,
    val error: String? = null
)

data class StorageQuota(
    val usedBytes: Long,
    val totalBytes: Long,
    val availableBytes: Long
)

data class RemoteFile(
    val id: String,
    val name: String,
    val sizeBytes: Long,
    val modifiedDate: Date,
    val mimeType: String,
    val downloadUrl: String? = null
)