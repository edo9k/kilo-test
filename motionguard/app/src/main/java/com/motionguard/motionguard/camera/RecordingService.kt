package com.motionguard.app.camera

import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.motionguard.app.R
import com.motionguard.app.model.MotionSettings
import kotlinx.coroutines.*

/**
 * Foreground service that runs continuous motion detection and recording.
 * Uses CameraX for video capture and OpenCV for motion analysis.
 */
class RecordingService : Service() {

    private val tag = "RecordingService"
    private var motionDetector: MotionDetector? = null
    private var videoRecorder: VideoRecorder? = null
    private var settings: MotionSettings = MotionSettings()
    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private var isMonitoring = false
    private var isRecording = false
    private var lastMotionTime = 0L
    private var cooldownUntil = 0L

    companion object {
        const val ACTION_START = "com.motionguard.action.START"
        const val ACTION_STOP = "com.motionguard.action.STOP"
        const val EXTRA_SETTINGS = "extra_settings"
        const val NOTIFICATION_ID = 1001
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val settings = intent.getParcelableExtra<MotionSettings>(EXTRA_SETTINGS)
                if (settings != null) {
                    this.settings = settings
                }
                startMonitoring()
            }
            ACTION_STOP -> {
                stopMonitoring()
                stopForeground(STOPForeground_KILL)
                stopSelf()
            }
        }
        return START_STICKY
    }

    override fun IBinder? = null

    private fun createNotificationChannel() {
        val channel = android.app.NotificationChannel(
            "motionguard_monitoring",
            "Motion Guard Monitoring",
            android.app.NotificationChannel.PRIORITY_LOW
        ).apply {
            description = "Motion detection and recording in progress"
            setLightsEnabled(false)
            importance = android.app.NotificationChannel.IMPORTANCE_LOW
        }
        val manager = notificationManager
        manager?.createNotificationChannel(channel)
    }

    private fun startMonitoring() {
        if (isMonitoring) return

        val notification = NotificationCompat.Builder(this, "motionguard_monitoring")
            .setSmallIcon(R.drawable.ic_camera)
            .setContentTitle("Motion Guard Active")
            .setContentText("Monitoring for motion...")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)
        isMonitoring = true

        serviceScope.launch {
            runMonitoringLoop()
        }
    }

    private fun stopMonitoring() {
        isMonitoring = false
        isRecording = false
        motionDetector?.release()
        videoRecorder?.release()
        motionDetector = null
        videoRecorder = null
    }

    private suspend fun runMonitoringLoop() {
        // This is a placeholder for the main monitoring loop.
        // In a full implementation, this would:
        // 1. Capture frames from CameraX preview
        // 2. Run motion detection via OpenCV
        // 3. Start recording when motion detected
        // 4. Stop recording after max duration or cooldown
        //
        // The actual frame processing happens in the VideoRecorder's preview
        // surface callback. This loop handles state management.

        while (isMonitoring) {
            delay(500) // Check state every 500ms
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        stopMonitoring()
    }
}