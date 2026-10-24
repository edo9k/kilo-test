# AGENTS.md

This file provides guidance to AI agents working with code in this repository.

## Repository Overview

This is a collection of small test projects for the Kilo AI IDE. Each subdirectory is a standalone project with different technologies and purposes.

## Project Structure

- `atari-dino/` - Atari 2600 6502 assembly game, built with DASM via Node.js
- `homepage/` - Static HTML homepage
- `k8s-upgrade-modeling/` - TLA+ formal specification for Kubernetes upgrades
- `k8s-wordle/` - Vanilla JS Wordle clone for Kubernetes terms (has tests)
- `motionguard/` - Android app (Kotlin/Java) for motion detection with cloud storage
- `pixel-runner/` - HTML5 Canvas platformer game deployable to Android

## Development Guidelines

### General
- Each project is independent - no shared build system or dependencies at root level
- Follow the existing code style in each project
- Don't add comments unless explicitly requested
- Read project-specific READMEs before making changes

### Testing
- `k8s-wordle/` has browser-based tests in `tests/tests.html` and `tests/wordbank.html` - run via local server
- Other projects may have their own test setups or be manually testable

### Building
- `atari-dino/`: `npm run build` or `node build.js` (requires romdevtools/dasm)
- `pixel-runner/`: Static files, can be served directly or built with Cordova/Capacitor
- `motionguard/`: Android project, build with Gradle/Android Studio
- `k8s-wordle/`, `homepage/`: No build step, serve as static files
- `k8s-upgrade-modeling/`: TLA+ spec, use TLC model checker

## Conventions
- Keep changes minimal and focused
- Preserve existing file structure
- For web projects, prefer vanilla implementations without adding build dependencies
- Test changes in the appropriate environment for each project type
