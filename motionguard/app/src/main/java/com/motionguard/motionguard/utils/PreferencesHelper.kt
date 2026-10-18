package com.motionguard.app.utils

import android.content.Context
import android.os.Environment
import com.google.gson.Gson
import com.motionguard.app.model.MotionSettings
import com.motionguard.app.model.VideoResolution
import java.io.File

/**
 * Persistent preferences helper using SharedPreferences.
 */
class PreferencesHelper(private val context: Context) {

    private val prefs = contextSharedPreferences(PREFS_NAME)
    private val gson = Gson()

    private val keyMonitoringActive = "monitoring_active"
    private val keySensitivity = "sensitivity"
    private val keyMaxDuration = "max_duration"
    private val keyCooldown = "cooldown"
    private val keyPreBuffer = "pre_buffer"
    private val keyRecordAudio = "record_audio"
    private val keyResolution = "resolution"
    private val keyContinuousMode = "continuous_mode"
    private val keyAutoDelete = "auto_delete"
    private val keyUploadOnWiFi = "upload_on_wifi"
    private val keyCloudProviders = "cloud_providers"

    private val keyGoogleDriveClientId = "google_drive_client_id"
    private val keyOneDriveClientId = "one_drive_client_id"
    private val keyDropboxAppKey = "dropbox_app_key"
    private val keyMegaAppKey = "mega_app_key"

    fun setMonitoringActive(active: Boolean) {
        prefs.edit().putBoolean(keyMonitoringActive, active).apply()
    }

    fun isMonitoringActive(): Boolean =
        prefs.getBoolean(keyMonitoringActive, false)

    fun getMotionSettings(): MotionSettings {
        val providersStr = prefs.getString(keyCloudProviders, "") ?: ""
        val providers = if (providersStr.isEmpty()) {
            emptySet()
        } else {
            providersStr.split(",").toSet()
        }

        val resolutionName = prefs.getString(keyResolution, VideoResolution.HD_720P.name)
        val resolution = try {
            VideoResolution.valueOf(resolutionName ?: VideoResolution.HD_720P.name)
        } catch (e: Exception) {
            VideoResolution.HD_720P
        }

        return MotionSettings(
            sensitivity = prefs.getFloat(keySensitivity, 0.05f),
            minMotionThreshold = prefs.getFloat("min_motion_threshold", 0.02f),
            maxRecordingDurationSec = prefs.getInt(keyMaxDuration, 30),
            preMotionBufferSec = prefs.getInt(keyPreBuffer, 3),
            cooldownSec = prefs.getInt(keyCooldown, 2),
            autoDeleteAfterUpload = prefs.getBoolean(keyAutoDelete, true),
            recordAudio = prefs.getBoolean(keyRecordAudio, true),
            resolution = resolution,
            continuousMode = prefs.getBoolean(keyContinuousMode, true),
            uploadOnWiFiOnly = prefs.getBoolean(keyUploadOnWiFi, false),
            cloudProviders = providers
        )
    }

    fun saveMotionSettings(settings: MotionSettings) {
        prefs.edit()
            .putFloat(keySensitivity, settings.sensitivity)
            .putInt(keyMaxDuration, settings.maxRecordingDurationSec)
            .putInt(keyCooldown, settings.cooldownSec)
            .putInt(keyPreBuffer, settings.preMotionBufferSec)
            .putBoolean(keyRecordAudio, settings.recordAudio)
            .putString(keyResolution, settings.resolution.name)
            .putBoolean(keyContinuousMode, settings.continuousMode)
            .putBoolean(keyAutoDelete, settings.autoDeleteAfterUpload)
            .putBoolean(keyUploadOnWiFi, settings.uploadOnWiFiOnly)
            .putString(keyCloudProviders, settings.cloudProviders.joinToString(","))
            .apply()
    }

    fun getGoogleDriveClientId(): String =
        prefs.getString(keyGoogleDriveClientId, "") ?: ""

    fun setGoogleDriveClientId(id: String) {
        prefs.edit().putString(keyGoogleDriveClientId, id).apply()
    }

    fun getOneDriveClientId(): String =
        prefs.getString(keyOneDriveClientId, "") ?: ""

    fun setOneDriveClientId(id: String) {
        prefs.edit().putString(keyOneDriveClientId, id).apply()
    }

    fun getDropboxAppKey(): String =
        prefs.getString(keyDropboxAppKey, "") ?: ""

    fun setDropboxAppKey(key: String) {
        prefs.edit().putString(keyDropboxAppKey, key).apply()
    }

    fun getMegaAppKey(): String =
        prefs.getString(keyMegaAppKey, "") ?: ""

    fun setMegaAppKey(key: String) {
        prefs.edit().putString(keyMegaAppKey, key).apply()
    }

    fun getOutputDirectory(): File {
        val dir = File(
            context.getExternalFilesDir(Environment.DIRECTORY_MOVIES),
            "MotionGuard"
        )
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    companion object {
        const val PREFS_NAME = "motionguard_prefs"
    }
}