# MotionGuard - Motion-Activated Camera App with Cloud Storage

MotionGuard is an Android app that uses the phone camera to detect movement and record short 30-second video clips whenever motion is captured. Recorded videos are automatically uploaded to cloud storage services like Google Drive, Microsoft OneDrive, Dropbox, and MEGA.

## Features

- **Motion Detection**: Uses OpenCV background subtraction to detect movement in real-time
- **Automatic Recording**: Records 30-second clips when motion is detected
- **Cloud Storage Integration**: Supports Google Drive, OneDrive, Dropbox, and MEGA
- **Continuous Monitoring**: Runs in foreground service with persistent notification
- **Upload History**: View all upload jobs and their status
- **Customizable Settings**: Adjust sensitivity, resolution, cooldown, and more
- **Background Upload**: Uses WorkManager for reliable background uploads with retry

## Project Structure

```
motionguard/
├── app/
│   ├── build.gradle              # Dependencies
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/motionguard/motionguard/
│   │   │   ├── MotionGuardApp.kt          # Application class
│   │   │   ├── model/                     # Data models
│   │   │   ├── camera/                    # Camera & motion detection
│   │   │   ├── storage/                   # Cloud storage services
│   │   │   ├── cloud/                     # Cloud config activities
│   │   │   └── ui/                        # Main UI activities
│   │   └── res/                           # Resources
│   │       ├── layout/                    # Activity layouts
│   │       ├── values/                    # Strings, colors, styles
│   │       └── drawable/                  # Icons
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
├── gradle.properties
├── build.sh
├── README.md
└── gradle/
```

## How It Works

1. **Monitoring**: The app starts a foreground service that monitors the camera feed
2. **Motion Detection**: OpenCV analyzes each frame using background subtraction
3. **Recording**: When motion is detected, a 30-second video clip is recorded
4. **Upload**: Recorded clips are uploaded to configured cloud storage services
5. **Cleanup**: After successful upload, local files can be auto-deleted

## Setup Instructions

### Prerequisites
- Android Studio (latest version)
- Android SDK (API level 24+)
- JDK 17

### Build Instructions

1. **Open the project** in Android Studio
2. **Sync Gradle** (File > Sync Project with Gradle Files)
3. **Build the APK**: Build > Build Bundle(s) / APK(s) > Build APK(s)
4. **Run on device**: Connect device and click Run

### Cloud Provider Setup

#### Google Drive
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Web Application)
5. Copy the Client ID and enter it in the app under Cloud Storage Settings

#### Microsoft OneDrive
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Under "Authentication", set redirect URI to `https://login.microsoftonline.com/common/oauth2/nativeclient2`
4. Enable "ID tokens" and "Access tokens" under Implicit grant
5. Copy the Application (client) ID and enter it in the app

#### Dropbox
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Create a new app
3. Choose "Scoped access" and select "Full Dropbox"
4. Copy the App key and enter it in the app

#### MEGA
1. Go to [MEGA Developers](https://mega.nz/developers)
2. Register for a developer account
3. Apply for an API key
4. Copy the App key and enter it in the app

## Dependencies

- **CameraX**: Google's camera API for video capture
- **OpenCV**: Computer vision library for motion detection
- **WorkManager**: Background task scheduling
- **Google Drive API**: Google Drive REST API
- **Microsoft Identity Client (MSAL)**: OneDrive authentication
- **Dropbox SDK**: Dropbox file access
- **MEGA SDK**: MEGA cloud storage

## Permissions Required

- Camera
- Record Audio
- Write External Storage
- Read External Storage
- Internet
- Foreground Service Camera
- Wake Lock

## License

This project is for educational purposes. Ensure you have appropriate permissions and comply with privacy laws before deploying.

## Disclaimer

This app requires camera and microphone permissions. Use responsibly and in compliance with local privacy laws. The developer is not responsible for any misuse of this software.
