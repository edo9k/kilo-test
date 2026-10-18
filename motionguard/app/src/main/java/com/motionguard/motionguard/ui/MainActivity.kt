package com.motionguard.app.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.motionguard.app.R
import com.motionguard.app.camera.RecordingService
import com.motionguard.app.cloud.CloudConfigActivity
import com.motionguard.app.cloud.UploadHistoryActivity
import com.motionguard.app.model.MotionSettings
import com.motionguard.app.storage.CloudStorageManager
import com.motionguard.app.utils.PreferencesHelper

/**
 * Main activity with start/stop controls and quick access to settings.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var prefsHelper: PreferencesHelper
    private var cloudManager: CloudStorageManager? = null

    private val settingsLauncher: ActivityResultLauncher<Intent> =
        registerForActivityResult(RESULT_START_ACTIVITY) { result ->
            if (result.resultCode == RESULT_OK) {
                // Settings saved
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefsHelper = PreferencesHelper(this)
        setupCloudManager()
        setupClickListeners()
        updateUIState()
    }

    private fun setupCloudManager() {
        val driveId = prefsHelper.getGoogleDriveClientId()
        val oneDriveId = prefsHelper.getOneDriveClientId()
        val dropboxKey = prefsHelper.getDropboxAppKey()
        val megaKey = prefsHelper.getMegaAppKey()

        cloudManager = CloudStorageManager(
            context = this,
            googleDriveClientId = driveId,
            oneDriveClientId = oneDriveId,
            dropboxAppKey = dropboxKey,
            megaAppKey = megaKey
        )
    }

    private fun setupClickListeners() {
        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnStartMonitoring).setOnClickListener {
            startMonitoring()
        }

        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnStopMonitoring).setOnClickListener {
            stopMonitoring()
        }

        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnCloudSettings).setOnClickListener {
            startActivity(Intent(this, CloudConfigActivity::class.java))
        }

        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnViewHistory).setOnClickListener {
            startActivity(Intent(this, UploadHistoryActivity::class.java))
        }

        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnSettings).setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
    }

    private fun startMonitoring() {
        val settings = prefsHelper.getMotionSettings()
        val intent = Intent(this, RecordingService::class.java).apply {
            action = RecordingService.ACTION_START
            putExtra(RecordingService.EXTRA_SETTINGS, settings)
        }
        startService(intent)

        prefsHelper.setMonitoringActive(true)
        Toast.makeText(this, "Motion Guard started", Toast.LENGTH_SHORT).show()
        updateUIState()
    }

    private fun stopMonitoring() {
        val intent = Intent(this, RecordingService::class.java).apply {
            action = RecordingService.ACTION_STOP
        }
        startService(intent)

        prefsHelper.setMonitoringActive(false)
        Toast.makeText(this, "Motion Guard stopped", Toast.LENGTH_SHORT).show()
        updateUIState()
    }

    private fun updateUIState() {
        val isMonitoring = prefsHelper.isMonitoringActive()
        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnStartMonitoring).isEnabled = !isMonitoring
        findViewById<androidx.appcompat.widget.AppCompatButton>(R.id.btnStopMonitoring).isEnabled = isMonitoring
    }

    override fun onDestroy() {
        super.onDestroy()
        cloudManager?.release()
    }
}