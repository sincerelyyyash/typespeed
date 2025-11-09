// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface TypingStats {
	startTime: number;
	characterCount: number;
}

const IDLE_TIMEOUT_MS = 3000; // 3 seconds
const CHARS_PER_WORD = 5;

let typingStats: TypingStats | null = null;
let idleTimeout: NodeJS.Timeout | null = null;
let statusBarItem: vscode.StatusBarItem;
let highestWPM: number = 0;
let extensionContext: vscode.ExtensionContext | undefined;

export const calculateWPM = (characterCount: number, timeElapsedMs: number): number => {
	if (timeElapsedMs === 0) {
		return 0;
	}
	const words = characterCount / CHARS_PER_WORD;
	const minutes = timeElapsedMs / (1000 * 60);
	return Math.round(words / minutes);
};

const updateStatusBar = (currentWPM: number | null): void => {
	if (currentWPM !== null) {
		statusBarItem.text = `⚡ ${currentWPM} WPM (🏆 ${highestWPM} WPM)`;
	} else {
		statusBarItem.text = `⚡ -- WPM (🏆 ${highestWPM} WPM)`;
	}
	statusBarItem.show();
};

const handleTypingStop = (): void => {
	if (!typingStats) {
		return;
	}

	const timeElapsed = Date.now() - typingStats.startTime;
	const currentWPM = calculateWPM(typingStats.characterCount, timeElapsed);

	if (currentWPM > highestWPM) {
		highestWPM = currentWPM;
		// Save highest score to globalState
		if (extensionContext) {
			extensionContext.globalState.update('typespeed.highestWPM', highestWPM);
		}
	}

	updateStatusBar(currentWPM);
	typingStats = null;
};

const resetIdleTimer = (): void => {
	if (idleTimeout) {
		clearTimeout(idleTimeout);
	}
	idleTimeout = setTimeout(() => {
		handleTypingStop();
	}, IDLE_TIMEOUT_MS);
};

const handleDocumentChange = (event: vscode.TextDocumentChangeEvent): void => {
	// Filter out non-typing events (paste, undo, etc.) by checking if it's a small insertion
	let validKeystroke = false;
	let addedChars = 0;

	for (const change of event.contentChanges) {
		// Consider it a valid keystroke if:
		// 1. Text was added (not just deleted)
		// 2. The added text is small (likely typing, not paste)
		// 3. The range length is small (single character or small edit)
		if (change.text.length > 0 && change.text.length <= 10 && change.rangeLength <= 10) {
			validKeystroke = true;
			addedChars += change.text.length;
		}
	}

	if (!validKeystroke || addedChars === 0) {
		return;
	}

	// Initialize or update typing stats
	if (!typingStats) {
		typingStats = {
			startTime: Date.now(),
			characterCount: 0
		};
	}

	typingStats.characterCount += addedChars;
	resetIdleTimer();
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Typing Speed extension is now active!');

	extensionContext = context;

	// Load highest score from globalState
	const savedHighestWPM = context.globalState.get<number>('typespeed.highestWPM', 0);
	highestWPM = savedHighestWPM;

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	updateStatusBar(null);
	context.subscriptions.push(statusBarItem);

	// Listen to document changes
	const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(handleDocumentChange);
	context.subscriptions.push(documentChangeDisposable);

	// Cleanup on deactivation
	context.subscriptions.push({
		dispose: () => {
			if (idleTimeout) {
				clearTimeout(idleTimeout);
			}
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (idleTimeout) {
		clearTimeout(idleTimeout);
	}
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
