# MotionGuard ProGuard Rules
# Keep OpenCV classes
-keep class org.opencv.** { *; }
-keep class com.google.api.** { *; }
-keep class com.microsoft.identity.** { *; }
-keep class com.dropbox.** { *; }
-keep class nz.mega.** { *; }

# Keep model classes
-keep class com.motionguard.app.model.** { *; }

# Keep annotations
-keepattributes *Annotation*
-keepclassmembers class * { @org.jetbrains.annotations.NotNull *; }

# Retrofit
-keepattributes Signature
-keepattributes Exceptions
-keep class retrofit2.** { *; }
-keep class com.squareup.okhttp3.** { *; }

# Gson
-keep class com.google.gson.** { *; }
-keepclassmembers class * { @com.google.gson.annotations.SerializedName <fields>; }

# Android
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# Preserve all native library classes
-keep class com.motionguard.app NativeLibraryHelper { *; }