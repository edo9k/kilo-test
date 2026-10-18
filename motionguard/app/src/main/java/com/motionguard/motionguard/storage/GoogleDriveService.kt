package com.motionguard.app.storage

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.services.drive.Drive
import com.google.api.services.drive.DriveScopes
import com.google.api.services.drive.model.File as DriveFile
import com.google.api.services.drive.model.FileList
import java.io.File
import java.util.*

/**
 * Google Drive storage implementation using Google Drive REST API v3.
 */
class GoogleDriveService(
    private val context: Context,
    private val clientId: String
) : CloudStorageService {

    override val provider = CloudProvider.GOOGLE_DRIVE

    private var drive: Drive? = null
    private var signInClient: GoogleSignInClient? = null
    private var token: String? = null

    init {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestServerClientId(clientId)
            .requestScopes(
                com.google.api.services.drive.DriveScopes.DRIVE_FILE,
                com.google.api.services.drive.DriveScopes.DRIVE_METADATA
            )
            .build()
        signInClient = GoogleSignIn.getClient(context, gso)
    }

    override fun isAuthenticated(): Boolean {
        return GoogleSignIn.hasSignedIn(context) && token != null
    }

    override suspend fun authenticate(): Boolean {
        return try {
            val result = suspendCoroutine<Boolean> { cont ->
                val signInClient = this.signInClient ?: run {
                    cont.resume(false)
                    return@suspendCoroutine
                }
                val signInIntent = signInClient.signInIntent
                // The actual result is handled in the Activity'sidentified
                cont.resume(false)
            }
            result
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun signOut() {
        token = null
        drive = null
        signInClient?.signOut(context)
    }

    override suspend fun uploadFile(
        localFile: File,
        remoteFileName: String,
        onProgress: (Float) -> Unit
    ): UploadResult {
        val currentDrive = drive ?: return UploadResult(success = false, error = "Not authenticated")

        return try {
            val driveFile = DriveFile()
            driveFile.name = remoteFileName
            driveFile.parents = listOf("appDataFolder")

            val content = java.io.FileInputStream(localFile)
            val mediaContent = com.google.api.client.googleapis.media.MediaHttpUploader()
                .setInputStream(content)
                .setFileSize(localFile.length())
                .setUploadType("resumable")
                .build()

            val result = currentDrive.files().create(driveFile, mediaContent).execute()
            onProgress(1.0f)

            UploadResult(
                success = true,
                remoteId = result.id,
                remoteUrl = "https://drive.google.com/file/d/${result.id}/view"
            )
        } catch (e: Exception) {
            UploadResult(success = false, error = e.message)
        }
    }

    override suspend fun getQuota(): StorageQuota? {
        // Drive API doesn't easily expose quota; return null
        return null
    }

    override suspend fun listFiles(): List<RemoteFile> {
        val currentDrive = drive ?: return emptyList()
        return try {
            val list: FileList = currentDrive.files().list()
                .setSpaces("appDataFolder")
                .setOrderBy("modifiedTime desc")
                .execute()
            list.files?.map { file ->
                RemoteFile(
                    id = file.id,
                    name = file.name,
                    sizeBytes = file.size ?: 0L,
                    modifiedDate = file.modifiedTime?.let { Date(it.value) } ?: Date(),
                    mimeType = file.mimeType ?: "",
                    downloadUrl = file.webViewLink
                )
            } ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    override suspend fun deleteFile(remoteId: String): Boolean {
        val currentDrive = drive ?: return false
        return try {
            currentDrive.files().delete(remoteId).execute()
            true
        } catch (e: Exception) {
            false
        }
    }

    override suspend fun getShareableUrl(remoteId: String): String? {
        val currentDrive = drive ?: return null
        return try {
            val file = currentDrive.files().get(remoteId)
                .setFields("webViewLink")
                .execute()
            file.webViewLink
        } catch (e: Exception) {
            null
        }
    }

    fun handleSignInResult(token: String) {
        this.token = token
        try {
            val httpTransport = GoogleNetHttpTransport.Builder().build()
            val jsonFactory = JacksonFactory.getDefaultInstance()
            drive = Drive.Builder(httpTransport, jsonFactory) {
                com.google.api.client.googleapis.auth.oauth2.AccessToken() {
                    this.token = token
                    this.expiresInSeconds = 3600
                }
            }.setApplicationName("MotionGuard").build()
        } catch (e: Exception) {
            drive = null
        }
    }
}