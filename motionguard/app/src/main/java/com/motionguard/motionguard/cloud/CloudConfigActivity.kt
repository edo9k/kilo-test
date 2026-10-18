package com.motionguard.app.cloud

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.motionguard.app.R
import com.motionguard.app.model.CloudProvider
import com.motionguard.app.utils.PreferencesHelper
import com.google.android.material.dialog.MaterialAlertDialogBuilder

/**
 * Activity for configuring cloud storage providers.
 */
class CloudConfigActivity : AppCompatActivity() {

    private lateinit var prefsHelper: PreferencesHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cloud_config)

        prefsHelper = PreferencesHelper(this)
        setupViews()
    }

    private fun setupViews() {
        val etDriveClientId = findViewById<EditText>(R.id.etDriveClientId)
        val etOneDriveClientId = findViewById<EditText>(R.id.etOneDriveClientId)
        val etDropboxAppKey = findViewById<EditText>(R.id.etDropboxAppKey)
        val etMegaAppKey = findViewById<EditText>(R.id.etMegaAppKey)
        val btnConnectDrive = findViewById<Button>(R.id.btnConnectDrive)
        val btnConnectOneDrive = findViewById<Button>(R.id.btnConnectOneDrive)
        val btnConnectDropbox = findViewById<Button>(R.id.btnConnectDropbox)
        val btnConnectMega = findViewById<Button>(R.id.btnConnectMega)
        val btnBack = findViewById<Button>(R.id.btnBack)

        etDriveClientId.setText(prefsHelper.getGoogleDriveClientId())
        etOneDriveClientId.setText(prefsHelper.getOneDriveClientId())
        etDropboxAppKey.setText(prefsHelper.getDropboxAppKey())
        etMegaAppKey.setText(prefsHelper.getMegaAppKey())

        btnConnectDrive.setOnClickListener {
            val id = etDriveClientId.text.toString().trim()
            prefsHelper.setGoogleDriveClientId(id)
            Toast.makeText(this, "Google Drive configured", Toast.LENGTH_SHORT).show()
        }

        btnConnectOneDrive.setOnClickListener {
            val id = etOneDriveClientId.text.toString().trim()
            prefsHelper.setOneDriveClientId(id)
            Toast.makeText(this, "OneDrive configured", Toast.LENGTH_SHORT).show()
        }

        btnConnectDropbox.setOnClickListener {
            val key = etDropboxAppKey.text.toString().trim()
            prefsHelper.setDropboxAppKey(key)
            Toast.makeText(this, "Dropbox configured", Toast.LENGTH_SHORT).show()
        }

        btnConnectMega.setOnClickListener {
            val key = etMegaAppKey.text.toString().trim()
            prefsHelper.setMegaAppKey(key)
            Toast.makeText(this, "MEGA configured", Toast.LENGTH_SHORT).show()
        }

        btnBack.setOnClickListener { finish() }
    }
}