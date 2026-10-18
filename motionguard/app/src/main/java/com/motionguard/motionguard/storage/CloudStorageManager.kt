package com.motionguard.app.storage

import android.content.Context
import android.util.Log
import java.io.File
import java.util.*
import kotlin.coroutines.CoroutineScope
import kotlin.coroutines.EmptyCoroutineContext
import kotlinx.coroutines.*

/**
 * Manages all cloud storage providers and orchestrates uploads.
 */
class CloudStorageManager(
    private val context: Context,
    private val googleDriveClientId: String = "",
    private val oneDriveClientId: String = "",
    private val dropboxAppKey: String = "",
    private val megaAppKey: String = ""
) {
    private val tag = "CloudStorageManager"

    private val services = mutableMapOf<CloudProvider, CloudStorageService>()

    private val _uploadJobs = mutableListOf<UploadJob>()
    val uploadJobs: List<UploadJob> get() = _uploadJobs.toList()

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    init {
        if (googleDriveClientId.isNotEmpty()) {
            services[CloudProvider.GOOGLE_DRIVE] = GoogleDriveService(context, googleDriveClientId)
        }
        if (oneDriveClientId.isNotEmpty()) {
            services[CloudProvider.ONE_DRIVE] = OneDriveService(context, oneDriveClientId)
        }
        if (dropboxAppKey.isNotEmpty()) {
            services[CloudProvider.DROPBOX] = DropboxService(context, dropboxAppKey)
        }
        if (megaAppKey.isNotEmpty()) {
            services[CloudProvider.MEGA] = MegaService(context, megaAppKey)
        }
    }

    fun getService(provider: CloudProvider): CloudStorageService? = services[provider]

    fun getAvailableProviders(): List<CloudProvider> = services.keys.toList()

    suspend fun authenticateProvider(provider: CloudProvider): Boolean {
        val service = services[provider] ?: return false
        return service.authenticate()
    }

    suspend fun uploadToAllProviders(
        file: File,
        fileName: String,
        providers: List<CloudProvider>,
        onProgress: (CloudProvider, Float) -> Unit = { _, _ -> }
    ): Map<CloudProvider, UploadResult> {
        val results = mutableMapOf<CloudProvider, UploadResult>()

        for (provider in providers) {
            val service = services[provider]
            if (service == null) {
                results[provider] = UploadResult(false, error = "Provider not configured")
                continue
            }

            if (!service.isAuthenticated()) {
                results[provider] = UploadResult(false, error = "Not authenticated")
                continue
            }

            try {
                val result = withContext(Dispatchers.IO) {
                    service.uploadFile(file, fileName) { progress ->
                        onProgress(provider, progress)
                    }
                }
                results[provider] = result
            } catch (e: Exception) {
                results[provider] = UploadResult(false, error = e.message)
            }
        }

        return results
    }

    fun addUploadJob(job: UploadJob) {
        _uploadJobs.add(0, job)
    }

    fun updateUploadJob(job: UploadJob) {
        val index = _uploadJobs.indexOfFirst { it.clipId == job.clipId }
        if (index >= 0) {
            _uploadJobs[index] = job
        }
    }

    fun getJobForClip(clipId: String): UploadJob? = _uploadJobs.find { it.clipId == clipId }

    fun removeJobForClip(clipId: String) {
        _uploadJobs.removeAll { it.clipId == clipId }
    }

    suspend fun signOutAll() {
        for (service in services.values) {
            try { service.signOut() } catch (e: Exception) {
                Log.w(tag, "Sign out failed for ${service.provider}", e)
            }
        }
    }

    fun release() {
        scope.cancel()
    }
}