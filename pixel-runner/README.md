# Pixel Runner - Android Side-Scrolling Platformer

A pixel-art style side-scrolling platformer game built with HTML5 Canvas, designed for Android deployment via Cordova or Capacitor.

## Game Features

- **Pixel-art graphics** - All sprites drawn programmatically with a retro aesthetic
- **Physics-based gameplay** - Gravity, jumping, and collision detection
- **Side-scrolling** - Endless procedurally generated terrain
- **Touch controls** - On-screen buttons optimized for mobile
- **Keyboard support** - Arrow keys or WASD for desktop testing
- **Score system** - Distance tracking with persistent high scores
- **Sound effects** - Web Audio API synthesized sounds
- **Responsive design** - Adapts to any screen size

## Controls

- **Left Arrow / A** - Move left
- **Right Arrow / D** - Move right
- **Up Arrow / Space / W** - Jump
- **Touch buttons** - On-screen controls for mobile

## Gameplay

- Run and jump across platforms
- Collect golden coins for bonus points (+50 each)
- Stomp on red enemies to defeat them
- Avoid falling into pits
- Travel as far as possible to increase your score

## Project Structure

```
pixel-runner/
├── index.html      # Main game HTML
├── style.css       # Mobile-optimized styling
├── game.js         # Complete game engine
├── config.xml      # Cordova configuration
├── build.sh        # Build helper script
├── README.md       # This file
└── res/            # Icons and splash screens (optional)
```

## Testing Locally

Open `index.html` in a web browser to test the game immediately. Use keyboard controls on desktop or resize to mobile dimensions.

For mobile testing, serve the files locally:
```bash
npx serve .
```
Then access via your local IP from a mobile device on the same network.

## Building for Android

### Using Cordova

```bash
# Install Cordova CLI globally
npm install -g cordova

# Create a new Cordova project
cordova create PixelRunner com.pixelrunner.game PixelRunner
cd PixelRunner

# Remove default www folder and copy game files
rm -rf www
cp -r /path/to/pixel-runner/* www/
# Copy config.xml
cp /path/to/config.xml config.xml

# Add Android platform
cordova platform add android@latest

# Build the APK
cordova build android --release
```

### Using Capacitor (Recommended)

```bash
# Install Capacitor
npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/android

# Initialize
npx cap init PixelRunner com.pixelrunner.game

# Copy game files to web directory
mkdir -p web
cp -r /path/to/pixel-runner/* web/

# Add Android platform
npx cap add android

# Sync and build
npx cap sync android
npx cap open android
```

## Customization

You can modify the game by editing `game.js`:
- `GRAVITY` - Adjust gravity strength
- `JUMP_FORCE` - Adjust jump height
- `MOVE_SPEED` / `MAX_SPEED` - Adjust player speed
- `TILE_SIZE` - Adjust pixel size
- Color values in sprite drawing functions

## License

Free to use and modify.
