package com.motionguard.app.camera

import android.util.Size
import org.opencv.core.*
import org.opencv.imgproc.Imgproc
import kotlin.math.abs

/**
 * Motion detector using OpenCV background subtraction.
 *
 * Algorithm:
 * 1. Convert frame to grayscale
  * 2. Apply Gaussian blur to reduce noise
 * 3. Compare against a running background model
 * 4. Threshold the difference to find motion pixels
 * 5. Compute a normalized motion score
 */
class MotionDetector(
    private val width: Int,
    private val height: Int,
    private val sensitivity: Float = 0.05f
) {
    private var background: Mat? = null
    private var diff = Mat()
    private var gray = Mat()
    private var blurred = Mat()
    private var firstFrame = true
    private var frameCount = 0
    private var lastMotionScore = 0.0
    private val learningRate = 0.02

    /**
     * Analyze a frame for motion. Returns a motion score 0.0 - 1.0.
     * Also returns a debug bitmap of the motion mask if requested.
     */
    fun analyze(
        rgbaBytes: ByteArray,
        debugMask: Mat? = null
    ): Double {
        val rgba = Mat(height, width, CvType.CV_8UC4)
        rgba.put(0, 0, rgbaBytes)

        Imgproc.cvtColor(rgba, gray, Imgproc.COLOR_RGBA2GRAY)
        Imgproc.GaussianBlur(gray, blurred, Size(9.0, 9.0), 2.0)

        if (firstFrame) {
            background = blurred.clone()
            firstFrame = false
            lastMotionScore = 0.0
            return 0.0
        }

        // Compute absolute difference
        Core.absdiff(blurred, background, diff)

        // Threshold
        val thresholdValue = (255 * sensitivity).coerceIn(5.0, 80.0)
        val thresholded = Mat()
        Imgproc.threshold(diff, thresholded, thresholdValue, 255.0, Imgproc.THRESH_BINARY)

        // Dilate to fill small gaps
        val kernel = Mat.ones(Size(3.0, 3.0), CvType.CV_8UC1)
        Imgproc.dilate(thresholded, thresholded, kernel, Point(-1.0, -1.0), 2)

        // Count motion pixels
        val motionPixels = Core.countNonZero(thresholded)
        val totalPixels = width * height
        val score = motionPixels.toDouble() / totalPixels.toDouble()

        // Update background model (running average)
        val alpha = learningRate
        Core.addWeighted(background, 1.0 - alpha, blurred, alpha, 0.0, background)

        // Copy debug mask
        if (debugMask != null) {
            thresholded.copyTo(debugMask)
        }

        thresholded.release()
        rgba.release()

        frameCount++
        lastMotionScore = score
        return score
    }

    fun getLastMotionScore(): Double = lastMotionScore

    fun reset() {
        background = null
        firstFrame = true
        frameCount = 0
        lastMotionScore = 0.0
    }

    fun release() {
        background?.release()
        diff.release()
        gray.release()
        blurred.release()
    }
}