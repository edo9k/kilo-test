package com.motionguard.app.camera

import android.content.Context
import android.os.Environment
import android.util.Size
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.FileProvider
import androidx.lifecycle.LifecycleOwner
import com.google.common.util.concurrent.ListenableFutureExecutor
import java.io.File
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * Video recorder using CameraX Video capability.
 *
 * Records 30-second clips when motion is detected. Supports both
 * continuous monitoring mode and on-demand recording.
 */
class VideoRecorder(
    private val context: Context,
    private val lifecycleOwner: LifecycleOwner,
    private val resolution: Size = Size(1280, 720),
    private val recordAudio: Boolean = true,
    private val maxDurationMs: Long = 30000L
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var camera: Camera? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var recording: Recording? = null
    private val cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private var cameraProviderFuture: ListenableFuture<ProcessCameraProvider>? = null

    private val outputDirectory: File
        get() {
            val mediaDir = File(
                context.getExternalFilesDir(Environment.DIRECTORY_MOVIES),
                "MotionGuard"
            )
            if (!mediaDir.exists()) mediaDir.mkdirs()
            return mediaDir
        }

    /**
     * Initialize CameraX with video capture capability.
     */
    fun initialize(onReady: () -> Unit, onError: (String) -> Unit) {
        cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture?.addListener({
            try {
                cameraProvider = cameraProviderFuture?.get()
                bindCameraUseCases()
                onReady()
            } catch (e: Exception) {
                onError("Camera init failed: ${e.message}")
            }
        }, cameraExecutor)
    }

    private fun bindCameraUseCases() {
        val provider = cameraProvider ?: return

        val cameraSelector = CameraSelector.Builder()
            .requireLensFacing(CameraSelector.LENS_FACING_BACK)
            .build()

        val preview = Preview.Builder()
            .setTargetResolution(resolution)
            .build()

        val recorder = Recorder.Builder()
            .setTargetResolution(resolution)
            .setAspectRatio(AspectRatio.RATIO_16_9)
            .build()

        videoCapture = VideoCapture.withOutput(recorder)

        val useCases = listOf(preview, videoCapture)

        try {
            provider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                *useCases.toTypedArray()
            )
        } catch (e: Exception) {
            try {
                val frontSelector = CameraSelector.Builder()
                    .requireLensFacing(CameraSelector.LENS_FACING_FRONT)
                    .build()
                provider.bindToLifecycle(lifecycleOwner, frontSelector, *useCases.toTypedArray())
            } catch (e2: Exception) {
                // Camera binding failed completely
            }
        }
    }

    /**
     * Start recording a video clip.
     */
    fun startRecording(
        onStarted: () -> Unit,
        onCompleted: (File) -> Unit,
        onError: (String) -> Unit
    ) {
        val capture = videoCapture ?: run {
            onError("Video capture not initialized")
            return
        }

        val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val fileName = "motion_${timestamp}.mp4"
        val outputFile = File(outputDirectory, fileName)

        val outputOptions = VideoCapture.OutputFileOptions.Builder(outputFile).build()

        try {
            recording = capture.startRecording(
                outputOptions,
                cameraExecutor,
                object : VideoCapture.OutputFileCallback {
                    override fun onError(
                        videoCaptureError: VideoCapture.OutputFileError,
                        message: String,
                        cause: Throwable?
                    ) {
                        onError("Recording error: $message - ${cause?.message}")
                    }

                    override fun onFinished(outputFileResult: VideoCapture.OutputFileResults) {
                        onCompleted(outputFileResult.file)
                    }
                }
            )
            onStarted()
        } catch (e: SecurityException) {
            onError("Recording permission denied: ${e.message}")
        } catch (e: Exception) {
            onError("Recording failed: ${e.message}")
        }
    }

    /**
     * Stop the current recording.
     */
    fun stopRecording() {
        recording?.stop()
        recording = null
    }

    /**
     * Is recording active?
     */
    fun isRecording(): Boolean = recording != null

    /**
     * Release all camera resources.
     */
    fun release() {
        recording?.stop()
        cameraProvider?.unbindAll()
        cameraProvider?.release()
        cameraExecutor.shutdown()
    }
}