# MotionGuard Build Script

#!/bin/bash
# Build MotionGuard Android app

set -e

echo "========================================="
echo "  MotionGuard - Android Build Script"
echo "========================================="

# Check prerequisites
if ! command -v java &> /dev/null; then
    echo "Error: Java JDK not found. Please install JDK 17 or later."
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "Warning: ANDROID_HOME not set. Attempting to find Android SDK..."
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
    elif [ -d "/usr/local/android-sdk" ]; then
        export ANDROID_HOME="/usr/local/android-sdk"
    fi
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "Error: Android SDK not found. Please install Android Studio and set ANDROID_HOME."
    exit 1
fi

echo "Using ANDROID_HOME: $ANDROID_HOME"
echo ""

# Create gradle wrapper if not present
if [ ! -f "gradlew" ]; then
    echo "Generating Gradle wrapper..."
    gradle wrapper --gradle-version 8.5
fi

# Build the app
echo "Building MotionGuard APK..."
./gradlew assembleRelease

# Find the APK
APK_PATH=$(find app/build/outputs/apk/release -name "*.apk" | head -n 1)

if [ -n "$APK_PATH" ]; then
    echo ""
    echo "========================================="
    echo "  BUILD SUCCESSFUL!"
    echo "========================================="
    echo "APK location: $APK_PATH"
    echo ""
    echo "To install on a connected device:"
    echo "  adb install -r $APK_PATH"
    echo ""
    echo "To build a debug APK:"
    echo "  ./gradlew assembleDebug"
else
    echo ""
    echo "Build completed. Check app/build/outputs/apk/ for the APK."
fi