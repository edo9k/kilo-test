package com.motionguard.app.model

import java.io.File
import java.util.Date

/**
 * Represents a recorded video clip from motion detection.
 */
data class VideoClip(
    val id: String,
    val file: File,
    val startTime: Date,
    val endTime: Date,
    val durationMs: Long,
    val motionScore: Double,
    val width: Int,
    val height: Int,
    val frameRate: Int,
    val sizeBytes: Long,
    val uploaded: Boolean = false,
    val cloudServices: List<String> = emptyList()
) {
    val durationSeconds: Long
        get() = durationMs / 1000

    val formattedDuration: String
        get() = String.format("%d:%02d", durationSeconds / 60, durationSeconds % 60)
}

/**
 * Cloud storage provider types supported by the app.
 */
enum class CloudProvider(
    val id: String,
    val displayName: String,
    val requiresOAuth: Boolean,
    val iconRes: String
) {
    GOOGLE_DRIVE(
        id = "google_drive",
        displayName = "Google Drive",
        requiresOAuth = true,
        iconRes = "ic_drive"
    ),
    ONE_DRIVE(
        id = "one_drive",
        displayName = "Microsoft OneDrive",
        requiresOAuth = true,
        iconRes = "ic_onedrive"
    ),
    DROPBOX(
        id = "dropbox",
        displayName = "Dropbox",
        requiresOAuth = true,
        iconRes = "ic_dropbox"
    ),
    MEGA(
        id = "mega",
        displayName = "MEGA",
        requiresOAuth = false,
        iconRes = "ic_mega"
    );

    companion object {
        fun fromId(id: String): CloudProvider? = values().find { it.id == id }
    }
}

/**
 * Upload job state.
 */
data class UploadJob(
    val clipId: String,
    val provider: CloudProvider,
    val status: UploadStatus,
    val progress: Float = 0f,
    val remoteId: String? = null,
    val remoteUrl: String? = null,
    val error: String? = null,
    val startTime: Date = Date(),
    val completedTime: Date? = null
)

enum class UploadStatus {
    QUEUED,
    UPLOADING,
    COMPLETED,
    FAILED,
    CANCELLED
}

/**
 * Motion detection settings.
 */
data class MotionSettings(
    val sensitivity: Float = 0.05f,          // 0.01 - 0.5
    val minMotionThreshold: Float = 0.02f,
    val maxRecordingDurationSec: Int = 30,
    val preMotionBufferSec: Int = 3,
    val cooldownSec: Int = 2,
    val autoDeleteAfterUpload: Boolean = true,
    val recordAudio: Boolean = true,
    val resolution: VideoResolution = VideoResolution.HD_720P,
    val continuousMode: Boolean = true,
    val uploadOnWiFiOnly: Boolean = false,
    val cloudProviders: Set<String> = setOf()
)

enum class VideoResolution(
    val width: Int,
    val height: Int,
    val displayName: String
) {
    HD_720P(1280, 720, "720p HD"),
    FHD_1080P(1920, 1080, "1080p Full HD"),
    SD_480P(854, 480, "480p SD"),
    UHD_4K(3840, 2160, "4K Ultra HD")
}

/**
 * Represents a motion detection event.
 */
data class MotionEvent(
    val timestamp: Long,
    val motionScore: Double,
    val frameWidth: Int,
    val frameHeight: Int
)

/**
 * Storage account connection state.
 */
data class CloudAccount(
    val provider: CloudProvider,
    val connected: Boolean,
    val accountEmail: String? = null,
    val quotaUsedBytes: Long? = null,
    val quotaTotalBytes: Long? = null,
    val lastSync: Date? = null
)