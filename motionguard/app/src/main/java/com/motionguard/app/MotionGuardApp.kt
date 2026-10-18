package com.motionguard.app

import android.app.Application
import android.util.Log
import org.opencv.android.OpenCVLoader

/**
 * Application class for MotionGuard.
 * Initializes OpenCV and other global services.
 */
class MotionGuardApp : Application() {

    private val tag = "MotionGuardApp"

    override fun onCreate() {
        super.onCreate()

        // Initialize OpenCV
        try {
            if (!OpenCVLoader.initDebug()) {
                Log.e(tag, "OpenCV initialization failed")
            } else {
                Log.d(tag, "OpenCV initialized successfully")
            }
        } catch (e: Exception) {
            Log.e(tag, "OpenCV init error", e)
        }
    }
}