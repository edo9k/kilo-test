# Atari 2600 Dino

A barebones Chrome-style Dino runner port for the Atari 2600 (6502 assembly). This project builds a raw binary (`dino.a26`) using DASM.

## Files

- `main.asm` - Main game logic written in 6502 assembly for the Atari 2600
- `build.js` - Build script using romdevtools/DASM to assemble the source
- `dino.a26` - Pre-built ROM binary
- `package.json` - NPM package configuration with build script

## Building

```bash
npm run build
```

Or directly:
```bash
node build.js
```

## Running

Load `dino.a26` in an Atari 2600 emulator (e.g., Stella). 

## Technical Details

- Target: Atari 2600 (MOS 6502)
- Assembly: DASM syntax
- Graphics: Uses TIA chip registers (VSYNC, VBLANK, WSYNC, COLUPF, COLUBK)
- Memory layout: Zero page variables for game state
