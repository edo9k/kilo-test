package com.motionguard.app.storage

import com.google.gson.annotations.SerializedName
import retrofit2.Call
import retrofit2.http.*

/**
 * Microsoft Graph API interface for OneDrive.
 */
interface OneDriveApi {

    companion object {
        fun create(token: String): OneDriveApi {
            val client = retrofit2.OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .addHeader("Content-Type", "application/json")
                        .build()
                    chain.proceed(request)
                }
                .build()

            val retrofit = retrofit2.Rest.Builder()
                .baseUrl("https://graph.microsoft.com/v1.0/")
                .client(client)
                .addConverterFactory(retrofit2.converter.gson.GsonConverterFactory.create())
                .build()
            return retrofit.create(OneDriveApi::class.java)
        }
    }

    @POST("me/drive/items/{item_id}/createUploadSession")
    @Headers("Content-Type: application/json")
    fun uploadFile(
        @Path("item_id") itemId: String,
        @Query("name") name: String
    ): Call<DriveItem>

    @POST("me/drive/approot/children")
    fun uploadFileToAppRoot(
        @Query("name") name: String,
        @Body body: Any
    ): Call<DriveItem>

    @POST("me/drive/items/{item_id}/content")
    fun uploadContent(
        @Path("item_id") itemId: String,
        @Body body: ByteArray
    ): Call<DriveItem>

    @GET("me/drive")
    fun getDriveInfo(): Call<DriveInfo>

    @GET("me/drive/approot/children")
    fun listDriveItems(): Call<DriveItemList>

    @DELETE("me/drive/items/{item_id}")
    fun deleteItem(@Path("item_id") itemId: String): Call<Void>

    @POST("me/drive/items/{item_id}/createLink")
    fun createShareLink(
        @Path("item_id") itemId: String,
        @Body body: ShareLinkRequest
    ): Call<ShareLinkResponse>

    @POST("me/drive/items/{item_id}/content")
    fun uploadItemContent(
        @Path("item_id") itemId: String,
        @Body body: ByteArray
    ): Call<DriveItem>
}

data class DriveItem(
    @SerializedName("id") val id: String? = null,
    @SerializedName("name") val name: String? = null,
    @SerializedName("size") val size: Long = 0,
    @SerializedName("webUrl") val webUrl: String? = null,
    @SerializedName("createdDateTime") val createdDateTime: String? = null,
    @SerializedName("modifiedDateTime") val modifiedTime: String? = null,
    @SerializedName("file") val file: DriveFile? = null
)

data class DriveFile(
    @SerializedName("mimeType") val mimeType: String? = null
)

data class DriveItemList(
    @SerializedName("value") val value: List<DriveItem> = emptyList()
)

data class DriveInfo(
    @SerializedName("usage") val usage: DriveUsage? = null,
    @SerializedName("total") val total: Long = 0,
    @SerializedName("available") val available: Long = 0
)

data class DriveUsage(
    @SerializedName("used") val usedBytes: Long = 0,
    @SerializedName("total") val totalBytes: Long = 0,
    @SerializedName("available") val availableBytes: Long = 0
)

data class ShareLinkRequest(
    @SerializedName("type") val type: String = "view",
    @SerializedName("scope") val scope: String = "anonymous"
)

data class ShareLinkResponse(
    @SerializedName("link") val link: ShareLink = ShareLink()
)

data class ShareLink(
    @SerializedName("webUrl") val webUrl: String? = null
)