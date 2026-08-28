#!/bin/bash
# Pixel Runner - Android Build Script

set -e

echo "========================================="
echo "  Pixel Runner - Android Build Script"
echo "========================================="
echo ""

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "Cordova not found. Installing..."
    npm install -g cordova
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java JDK not found. Please install JDK 17 or later."
    exit 1
fi

# Check if Android SDK is available
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

# Create project directory
PROJECT_DIR="PixelRunner"
if [ -d "$PROJECT_DIR" ]; then
    echo "Project directory already exists. Using existing project."
    cd "$PROJECT_DIR"
else
    echo "Creating new Cordova project..."
    cordova create "$PROJECT_DIR" com.pixelrunner.game PixelRunner
    cd "$PROJECT_DIR"
fi

# Copy game files
echo "Copying game files..."
rm -rf www
cp -r ../*.html ../*.css ../*.js ../*.xml www/
cp ../README.md www/README.md

# Copy config.xml to project root if not already there
cp www/config.xml . 2>/dev/null || true

# Add Android platform if not already added
if [ ! -d "platforms/android" ]; then
    echo "Adding Android platform..."
    cordova platform add android@latest
fi

# Build the app
echo ""
echo "Building Android APK..."
cordova build android --release

# Find the APK
APK_PATH=$(find platforms/android -name "*.apk" | head -n 1)

if [ -n "$APK_PATH" ]; then
    echo ""
    echo "========================================="
    echo "  BUILD SUCCESSFUL!"
    echo "========================================="
    echo "APK location: $APK_PATH"
    echo ""
    echo "To install on a connected device:"
    echo "  cordova run android"
    echo ""
    echo "To build a debug APK:"
    echo "  cordova build android"
else
    echo ""
    echo "Build completed. Check platforms/android/app/build/outputs/apk/ for the APK."
fi
