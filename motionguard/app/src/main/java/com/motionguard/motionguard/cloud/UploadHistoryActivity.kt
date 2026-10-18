package com.motionguard.app.cloud

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.motionguard.app.R
import com.motionguard.app.model.UploadJob
import com.motionguard.app.model.UploadStatus
import com.motionguard.app.utils.PreferencesHelper
import com.motionguard.app.storage.CloudStorageManager
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import kotlinx.android.synthetic.main.activity_upload_history.*
import kotlinx.coroutines.launch

/**
 * Activity showing upload history for recorded clips.
 */
class UploadHistoryActivity : AppCompatActivity() {

    private lateinit var prefsHelper: PreferencesHelper
    private var cloudManager: CloudStorageManager? = null
    private val adapter = UploadHistoryAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_upload_history)

        prefsHelper = PreferencesHelper(this)
        setupCloudManager()
        setupViews()
        loadHistory()
    }

    private fun setupCloudManager() {
        cloudManager = CloudStorageManager(
            context = this,
            googleDriveClientId = prefsHelper.getGoogleDriveClientId(),
            oneDriveClientId = prefsHelper.getOneDriveClientId(),
            dropboxAppKey = prefsHelper.getDropboxAppKey(),
            megaAppKey = prefsHelper.getMegaAppKey()
        )
    }

    private fun setupViews() {
        findViewById<Button>(R.id.btnBack).setOnClickListener { finish() }
        val rvHistory = findViewById<androidx.appcompat.widget.AppCompatListView>(R.id.rvHistory)
        rvHistory.adapter = adapter
    }

    private fun loadHistory() {
        lifecycleScope.launch {
            val manager = cloudManager ?: return@launch
            val jobs = manager.uploadJobs
            adapter.submitList(jobs)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        cloudManager?.release()
    }
}

class UploadHistoryAdapter : android.widget.BaseAdapter() {
    private var items: List<UploadJob> = emptyList()

    fun submitList(newItems: List<UploadJob>) {
        items = newItems
       notifyDataSetChanged()
    }

    override fun getCount(): Int = items.size
    override fun getItem(position: Int): UploadJob = items[position]
    override fun getItemId(position: Int): Long = position.toLong()

    override fun getView(position: Int, CONVERTVIEW: View?, parent: ViewGroup): View {
        val view = View.inflate(parent.context, R.layout.item_upload_history, null)
        val job = getItem(position)

        val tvClipId = view.findViewById<TextInputEditText>(R.id.tvClipId)
        val tvProvider = view.findViewById<TextInputEditText>(R.id.tvProvider)
        val tvStatus = view.findViewById<TextInputEditText>(R.id.tvStatus)
        val tvProgress = view.findViewById<TextInputEditText>(R.id.tvProgress)

        tvClipId.setText("Clip: ${job.clipId}")
        tvProvider.setText("Provider: ${job.provider.displayName}")
        tvStatus.setText("Status: ${job.status}")
        tvProgress.setText("Progress: ${(job.progress * 100).toInt()}%")

        val statusColor = when (job.status) {
            UploadStatus.COMPLETED -> android.R.color.holo_green_dark
            UploadStatus.UPLOADING -> android.R.color.holo_blue_dark
            UploadStatus.FAILED -> android.R.color.holo_red_dark
            else -> android.R.color.darker_gray
        }
        tvStatus.setTextColor(view.context.getColor(statusColor))

        return view
    }
}