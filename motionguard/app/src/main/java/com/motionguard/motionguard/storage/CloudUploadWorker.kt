package com.motionguard.app.storage

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.motionguard.app.model.CloudProvider
import com.motionguard.app.model.VideoClip
import com.motionguard.app.utils.PreferencesHelper
import java.io.File

/**
 * Background worker that uploads recorded clips to configured cloud providers.
 * Uses WorkManager for reliable background upload with retry support.
 */
class CloudUploadWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    private val tag = "CloudUploadWorker"

    override suspend fun doWork(): Result = try {
        val clipId = inputData.getString(KEY_CLIP_ID) ?: return Result.failure()
        val prefsHelper = PreferencesHelper(applicationContext)

        // Get the clip file
        val clip = getClipById(applicationContext, clipId) ?: return Result.failure()

        // Get configured providers
        val settings = prefsHelper.getMotionSettings()
        val providers = settings.cloudProviders.mapNotNull { CloudProvider.fromId(it) }

        if (providers.isEmpty()) {
            Log.w(tag, "No cloud providers configured")
            return Result.success()
        }

        // Upload to each provider
        for (provider in providers) {
            try {
                uploadToProvider(applicationContext, clip, provider, prefsHelper)
            } catch (e: Exception) {
                Log.e(tag, "Upload failed for ${provider.id}", e)
                return Result.retry()
            }
        }

        // Auto-delete local file after successful upload
        if (settings.autoDeleteAfterUpload && clip.file.exists()) {
            clip.file.delete()
        }

        Result.success()
    } catch (e: Exception) {
        Log.e(tag, "Worker failed", e)
        Result.retry()
    }

    private suspend fun uploadToProvider(
        context: Context,
        clip: VideoClip,
        provider: CloudProvider,
        prefsHelper: PreferencesHelper
    ) {
        // Implementation would use the appropriate service
        Log.d(tag, "Uploading ${clip.file.name} to ${provider.displayName}")
    }

    private fun getClipById(context: Context, clipId: String): VideoClip? {
        val prefsHelper = PreferencesHelper(context)
        val outputDir = prefsHelper.getOutputDirectory()
        val file = File(outputDir, "motion_${clipId}.mp4")
        return if (file.exists()) {
            VideoClip(
                id = clipId,
                file = file,
                startTime = java.util.Date(file.lastModified()),
                endTime = java.util.Date(file.lastModified() + 30000),
                durationMs = 30000,
                motionScore = 0.0,
                width = 1280,
                height = 720,
                frameRate = 30,
                sizeBytes = file.length()
            )
        } else null
    }

    companion object {
        const val KEY_CLIP_ID = "clip_id"
        const val KEY_PROVIDER = "provider"

        fun createInputData(clipId: String, provider: String? = null) =
            androidx.work.Data.Builder()
                .putString(KEY_CLIP_ID, clipId)
                .let { if (provider != null) it.putString(KEY_PROVIDER, provider) else it }
                .build()
    }
}