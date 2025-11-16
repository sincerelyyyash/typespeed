# Change Log

All notable changes to the "typespeed" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.5] - 2025-11-16

### Added
- Clickable status bar item that opens a popover menu
- Reset highscore WPM functionality via menu option
- Confirmation dialog before resetting highscore to prevent accidental resets
- Menu command registration for easy access to reset functionality

### Changed
- Status bar item is now interactive with tooltip indicating clickability
- Improved user experience with menu-based actions

## [0.0.4] - 2025-11-10

### Changed
- Updated status bar iconography to improve legibility and match VS Code's latest icon set.
- Synced package metadata to version `0.0.4`.

## [0.0.1] - 2024-11-09

### Added
- Initial release of Typing Speed extension
- Real-time WPM (Words Per Minute) calculation
- Status bar display showing current and highest WPM
- Highest score tracking and persistence across sessions
- Global typing tracking across all files and editors
- Smart detection that filters out paste operations and large edits
- 3-second idle detection before calculating WPM