# Typing Speed

A VS Code extension that calculates and displays your typing speed (WPM - Words Per Minute) in the status bar when you stop typing.

## Features

- **Real-time Typing Speed Tracking**: Automatically tracks your typing speed as you code
- **WPM Calculation**: Calculates Words Per Minute based on characters typed
- **Status Bar Display**: Shows your current WPM and highest score in the status bar
- **Persistent High Score**: Remembers your best typing speed across sessions
- **Global Tracking**: Tracks typing across all files and editors
- **Smart Detection**: Filters out paste operations and large edits to only track actual typing

## How It Works

1. The extension automatically activates when VS Code starts
2. It tracks your keystrokes as you type code
3. When you stop typing for 3 seconds, it calculates your WPM
4. Your current WPM and highest score are displayed in the status bar
5. The highest score is saved and persists across VS Code sessions

## Status Bar Format

The status bar displays: `⚡ X WPM (🏆 Y WPM)`
- **X** = Your current/last calculated WPM
- **Y** = Your all-time highest WPM

## Requirements

- VS Code version 1.105.0 or higher

## Extension Settings

This extension does not add any VS Code settings. It works automatically once installed.

## Release Notes

### 0.0.1

Initial release of Typing Speed extension
- Real-time WPM calculation
- Status bar display
- Highest score tracking and persistence
- Global typing tracking across all files

---

## For more information

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [VS Code API Documentation](https://code.visualstudio.com/api)

**Enjoy tracking your typing speed!**
