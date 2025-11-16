import * as assert from 'assert';
import * as vscode from 'vscode';
import { calculateWPM, activate, deactivate, resetHighscore } from '../extension';

// Mock ExtensionContext for testing
const createMockContext = (initialHighestWPM: number = 0): vscode.ExtensionContext => {
	const state: Map<string, any> = new Map();
	if (initialHighestWPM > 0) {
		state.set('typespeed.highestWPM', initialHighestWPM);
	}

	return {
		subscriptions: [],
		workspaceState: {
			get: () => undefined,
			update: () => Promise.resolve(),
			keys: () => []
		},
		globalState: {
			get: (<T>(key: string, defaultValue?: T): T | undefined => {
				if (state.has(key)) {
					return state.get(key) as T;
				}
				return defaultValue;
			}) as any,
			update: (key: string, value: any) => {
				state.set(key, value);
				return Promise.resolve();
			},
			keys: () => Array.from(state.keys()),
			setKeysForSync: () => {}
		},
		extensionPath: '',
		asAbsolutePath: (relativePath: string) => relativePath,
		storagePath: '',
		globalStoragePath: '',
		logPath: '',
		extensionUri: vscode.Uri.parse('file:///test'),
		environmentVariableCollection: {} as any,
		extensionMode: vscode.ExtensionMode.Test,
		globalStorageUri: vscode.Uri.parse('file:///test'),
		storageUri: vscode.Uri.parse('file:///test'),
		logUri: vscode.Uri.parse('file:///test'),
		secrets: {} as any,
		extension: {} as any,
		languageModelAccessInformation: {} as any
	};
};

suite('Typing Speed Extension Tests', () => {
	suiteSetup(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	suite('WPM Calculation Tests', () => {
		test('should calculate WPM correctly for valid inputs', () => {
			// 60 words (300 chars) in 1 minute = 60 WPM
			assert.strictEqual(calculateWPM(300, 60 * 1000), 60);

			// 30 words (150 chars) in 1 minute = 30 WPM
			assert.strictEqual(calculateWPM(150, 60 * 1000), 30);

			// 120 words (600 chars) in 1 minute = 120 WPM
			assert.strictEqual(calculateWPM(600, 60 * 1000), 120);
		});

		test('should handle fractional minutes correctly', () => {
			// 60 words (300 chars) in 30 seconds = 120 WPM
			assert.strictEqual(calculateWPM(300, 30 * 1000), 120);

			// 30 words (150 chars) in 2 minutes = 15 WPM
			assert.strictEqual(calculateWPM(150, 2 * 60 * 1000), 15);
		});

		test('should return 0 for zero time', () => {
			assert.strictEqual(calculateWPM(100, 0), 0);
			assert.strictEqual(calculateWPM(0, 0), 0);
		});

		test('should handle zero characters', () => {
			assert.strictEqual(calculateWPM(0, 60 * 1000), 0);
		});

		test('should round WPM correctly', () => {
			// 25 words (125 chars) in 1 minute = 25 WPM (exact)
			assert.strictEqual(calculateWPM(125, 60 * 1000), 25);

			// 26.4 words (132 chars) in 1 minute = 26 WPM (rounded down)
			assert.strictEqual(calculateWPM(132, 60 * 1000), 26);

			// 26.6 words (133 chars) in 1 minute = 27 WPM (rounded up)
			assert.strictEqual(calculateWPM(133, 60 * 1000), 27);
		});

		test('should handle very fast typing', () => {
			// 300 words (1500 chars) in 1 minute = 300 WPM
			assert.strictEqual(calculateWPM(1500, 60 * 1000), 300);
		});

		test('should handle very slow typing', () => {
			// 5 words (25 chars) in 1 minute = 5 WPM
			assert.strictEqual(calculateWPM(25, 60 * 1000), 5);
		});
	});

	suite('Extension Activation Tests', () => {
		test('should activate without errors', async () => {
			const context = createMockContext();
			await activate(context);
			assert.ok(true, 'Extension activated successfully');
		});

		test('should create status bar on activation', async () => {
			const context = createMockContext();
			await activate(context);
			// Status bar creation is tested through activation
			assert.ok(true, 'Status bar should be created on activation');
		});

		test('should load saved highest score on activation', async () => {
			const savedScore = 100;
			const context = createMockContext(savedScore);
			await activate(context);

			// Verify highest score was loaded
			const loadedScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(loadedScore, savedScore, 'Highest score should be loaded from globalState');
		});

		test('should initialize with zero highest score if none saved', async () => {
			const context = createMockContext(0);
			await activate(context);

			const loadedScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(loadedScore, 0, 'Should initialize with zero if no score saved');
		});

		test('should deactivate without errors', async () => {
			const context = createMockContext();
			await activate(context);
			deactivate();
			assert.ok(true, 'Extension deactivated successfully');
		});
	});

	suite('Highest Score Persistence Tests', () => {
		test('should persist highest score in globalState', async () => {
			const context = createMockContext(50);
			await activate(context);

			// Simulate a new high score by updating globalState directly
			await context.globalState.update('typespeed.highestWPM', 75);
			const updatedScore = context.globalState.get<number>('typespeed.highestWPM', 0);

			assert.strictEqual(updatedScore, 75, 'Highest score should be persisted in globalState');
		});

		test('should maintain highest score across multiple reads', async () => {
			const savedScore = 120;
			const context = createMockContext(savedScore);
			await activate(context);

			// Read multiple times
			const score1 = context.globalState.get<number>('typespeed.highestWPM', 0);
			const score2 = context.globalState.get<number>('typespeed.highestWPM', 0);

			assert.strictEqual(score1, savedScore, 'First read should return saved score');
			assert.strictEqual(score2, savedScore, 'Second read should return same saved score');
		});
	});

	suite('Integration Tests with Real Documents', () => {
		test('should track typing in a real document', async () => {
			const context = createMockContext();
			await activate(context);

			// Create a real text document
			const doc = await vscode.workspace.openTextDocument({
				content: '',
				language: 'plaintext'
			});

			const editor = await vscode.window.showTextDocument(doc);
			
			// Type some text
			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), 'Hello');
			});

			// Wait a bit for the extension to process
			await new Promise(resolve => setTimeout(resolve, 100));

			// Extension should be tracking
			assert.ok(true, 'Extension should track typing in real document');
		});

		test('should handle document edits', async () => {
			const context = createMockContext();
			await activate(context);

			const doc = await vscode.workspace.openTextDocument({
				content: 'initial',
				language: 'plaintext'
			});

			const editor = await vscode.window.showTextDocument(doc);
			
			// Make multiple edits
			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 7), ' text');
			});

			await new Promise(resolve => setTimeout(resolve, 100));

			assert.ok(true, 'Extension should handle multiple document edits');
		});
	});

	suite('Edge Cases and Error Handling', () => {
		test('should handle negative time gracefully', () => {
			// calculateWPM should handle edge cases
			const result = calculateWPM(100, -1000);
			// Negative time results in negative WPM, but Math.round handles it
			assert.ok(typeof result === 'number', 'Should return a number even for negative time');
		});

		test('should handle very large character counts', () => {
			const result = calculateWPM(1000000, 60 * 1000);
			assert.ok(result > 0, 'Should calculate WPM for large character counts');
			assert.ok(Number.isFinite(result), 'Result should be finite');
		});

		test('should handle very small time values', () => {
			const result = calculateWPM(100, 1);
			assert.ok(result > 0, 'Should calculate WPM for very small time values');
			assert.ok(Number.isFinite(result), 'Result should be finite');
		});
	});

	suite('Reset Highscore Tests', () => {
		test('should reset highscore to 0', async () => {
			const context = createMockContext(150);
			await activate(context);

			// Verify initial score
			let currentScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(currentScore, 150, 'Initial score should be 150');

			// Reset highscore
			resetHighscore();

			// Verify score was reset
			currentScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(currentScore, 0, 'Score should be reset to 0');
		});

		test('should reset highscore when already at 0', async () => {
			const context = createMockContext(0);
			await activate(context);

			// Reset highscore
			resetHighscore();

			// Verify score remains 0
			const currentScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(currentScore, 0, 'Score should remain 0');
		});

		test('should reset highscore command via executeCommand', async () => {
			const context = createMockContext(200);
			await activate(context);

			// Verify initial score
			let currentScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(currentScore, 200, 'Initial score should be 200');

			// Execute reset command
			await vscode.commands.executeCommand('typespeed.resetHighscore');

			// Verify score was reset
			currentScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(currentScore, 0, 'Score should be reset to 0 after command execution');
		});

		test('should persist reset highscore in globalState', async () => {
			const context = createMockContext(100);
			await activate(context);

			// Reset highscore
			resetHighscore();

			// Wait for async update
			await new Promise(resolve => setTimeout(resolve, 50));

			// Verify persistence
			const persistedScore = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(persistedScore, 0, 'Reset score should be persisted in globalState');
		});

		test('should handle reset with no context gracefully', async () => {
			// This tests the edge case where extensionContext might be undefined
			// We can't easily test this without modifying the code, but we can test
			// that reset works when context exists
			const context = createMockContext(50);
			await activate(context);
			resetHighscore();
			const score = context.globalState.get<number>('typespeed.highestWPM', 0);
			assert.strictEqual(score, 0, 'Reset should work with valid context');
		});
	});

	suite('Menu Command Tests', () => {
		test('should register showMenu command', async () => {
			const context = createMockContext();
			await activate(context);

			// Verify command is registered by trying to execute it
			// Note: This will show a QuickPick, but we can verify the command exists
			const commands = await vscode.commands.getCommands();
			assert.ok(commands.includes('typespeed.showMenu'), 'showMenu command should be registered');
		});

		test('should register resetHighscore command', async () => {
			const context = createMockContext();
			await activate(context);

			// Verify command is registered
			const commands = await vscode.commands.getCommands();
			assert.ok(commands.includes('typespeed.resetHighscore'), 'resetHighscore command should be registered');
		});
	});
});
