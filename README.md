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

The status bar displays: `$(zap) X WPM ($(milestone) Y WPM)`
- **X** = Your current/last calculated WPM
- **Y** = Your all-time highest WPM

## Requirements

- VS Code/Cursor version 1.60.0 or higher
- Node.js (for building from source)

## Installation

### Install Locally from Source

Follow these steps to install the extension locally in Cursor or VS Code after cloning the repository:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/sincerelyyyash/typespeed.git
cd typespeed
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Compile the Extension

```bash
npm run compile
```

#### Step 4: Package the Extension

```bash
npm run package
```

This will create a `typespeed-0.0.1.vsix` file in the project root.

#### Step 5: Install the Extension

**Option A: Using Command Palette (Recommended)**

1. Open Cursor or VS Code
2. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux) to open the Command Palette
3. Type: `Extensions: Install from VSIX...`
4. Select the `typespeed-0.0.1.vsix` file from the project root
5. Restart Cursor/VS Code if prompted

**Option B: Using Terminal**

For VS Code:
```bash
code --install-extension typespeed-0.0.1.vsix
```

For Cursor:
```bash
cursor --install-extension typespeed-0.0.1.vsix
```

#### Step 6: Verify Installation

1. Open any file in Cursor/VS Code
2. Start typing
3. Check the status bar (bottom right) - you should see: `$(zap) -- WPM ($(milestone) 0 WPM)`
4. After you stop typing for 3 seconds, your WPM will be calculated and displayed

### Development Mode

To develop and test the extension locally:

1. Run the watch mode to auto-compile on changes:
   ```bash
   npm run watch
   ```

2. Press `F5` in VS Code/Cursor to launch the Extension Development Host
3. A new window will open with your extension loaded
4. Make changes to your code - it will auto-compile, then reload the extension host window

### Updating the Extension

When you make changes to the extension:

1. Run `npm run compile` to rebuild
2. Run `npm run package` to create a new `.vsix` file
3. Install the new `.vsix` file (it will replace the old version)

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
