package com.motionguard.app.ui

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.motionguard.app.R
import com.motionguard.app.model.MotionSettings
import com.motionguard.app.model.VideoResolution
import com.motionguard.app.utils.PreferencesHelper

/**
 * Activity for configuring motion detection and recording settings.
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var prefsHelper: PreferencesHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        prefsHelper = PreferencesHelper(this)
        setupViews()
    }

    private fun setupViews() {
        val etSensitivity = findViewById<EditText>(R.id.etSensitivity)
        val etMaxDuration = findViewById<EditText>(R.id.etMaxDuration)
        val etCooldown = findViewById<EditText>(R.id.etCooldown)
        val etPreBuffer = findViewById<EditText>(R.id.etPreBuffer)
        val swRecordAudio = findViewById<Switch>(R.id.swRecordAudio)
        val swContinuousMode = findViewById<Switch>(R.id.swContinuousMode)
        val swAutoDelete = findViewById<Switch>(R.id.swAutoDelete)
        val swUploadOnWiFi = findViewById<Switch>(R.id.swUploadOnWiFi)
        val spinnerResolution = findViewById<Spinner>(R.id.spinnerResolution)
        val btnBack = findViewById<Button>(R.id.btnBack)
        val btnReset = findViewById<Button>(R.id.btnReset)

        val settings = prefsHelper.getMotionSettings()

        etSensitivity.setText("%.2f".format(settings.sensitivity))
        etMaxDuration.setText(settings.maxRecordingDurationSec.toString())
        etCooldown.setText(settings.cooldownSec.toString())
        etPreBuffer.setText(settings.preMotionBufferSec.toString())
        swRecordAudio.isChecked = settings.recordAudio
        swContinuousMode.isChecked = settings.continuousMode
        swAutoDelete.isChecked = settings.autoDeleteAfterUpload
        swUploadOnWiFi.isChecked = settings.uploadOnWiFiOnly

        val resolutionAdapter = android.widget.ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            VideoResolution.values().map { it.displayName }
        )
        resolutionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerResolution.adapter = resolutionAdapter
        spinnerResolution.setSelection(VideoResolution.values().indexOf(settings.resolution))

        btnBack.setOnClickListener { finish() }

        btnReset.setOnClickListener {
            MaterialAlertDialogBuilder(this)
                .setTitle("Reset Settings")
                .setMessage("Are you sure you want to reset all settings to default?")
                .set"Yes" { _, _ ->
                    prefsHelper.saveMotionSettings(MotionSettings())
                    recreate()
                }
                .set"No", null)
                .show()
        }

        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
    }

    private fun saveSettings() {
        val etSensitivity = findViewById<EditText>(R.id.etSensitivity)
        val etMaxDuration = findViewById<EditText>(R.id.etMaxDuration)
        val etCooldown = findViewById<EditText>(R.id.etCooldown)
        val etPreBuffer = findViewById<EditText>(R.id.etPreBuffer)
        val swRecordAudio = findViewById<Switch>(R.id.swRecordAudio)
        val swContinuousMode = findViewById<Switch>(R.id.swContinuousMode)
        val swAutoDelete = findViewById<Switch>(R.id.swAutoDelete)
        val swUploadOnWiFi = findViewById<Switch>(R.id.swUploadOnWiFi)
        val spinnerResolution = findViewById<Spinner>(R.id.spinnerResolution)

        val settings = MotionSettings(
            sensitivity = etSensitivity.text.toString().toFloatOrNull() ?: 0.05f,
            maxRecordingDurationSec = etMaxDuration.text.toString().toIntOrNull() ?: 30,
            cooldownSec = etCooldown.text.toString().toIntOrNull() ?: 2,
            preMotionBufferSec = etPreBuffer.text.toString().toIntOrNull() ?: 3,
            recordAudio = swRecordAudio.isChecked,
            continuousMode = swContinuousMode.isChecked,
            autoDeleteAfterUpload = swAutoDelete.isChecked,
            uploadOnWiFiOnly = swUploadOnWiFi.isChecked,
            resolution = VideoResolution.values()[spinnerResolution.selectedItemPosition]
        )
        prefsHelper.saveMotionSettings(settings)
        Toast.makeText(this, "Settings saved", Toast.LENGTH_SHORT).show()
    }

    override fun onPause() {
        super.onPause()
        saveSettings()
    }
}