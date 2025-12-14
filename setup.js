#!/usr/bin/env node

/**
 * Setup script for Friday Discord Bot
 * Builds TypeScript code and runs the bot
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Execute a command and stream output
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {string} description - Description of the step
 * @returns {Promise<number>} Exit code
 */
function executeCommand(command, args, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`${description}`);
        console.log(`${'='.repeat(60)}\n`);

        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            cwd: __dirname
        });

        child.on('error', (error) => {
            reject(error);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`${description} failed with exit code ${code}`));
            } else {
                console.log(`\n✓ ${description} completed successfully\n`);
                resolve(code);
            }
        });
    });
}

/**
 * Main setup function
 */
async function setup() {
    try {
        console.log('\n╔════════════════════════════════════════╗');
        console.log('║   Friday Bot - Setup & Run Script    ║');
        console.log('╚════════════════════════════════════════╝\n');

        // Step 1: Install dependencies
        await executeCommand('npm', ['install'], 'Installing dependencies');

        // Step 2: Build TypeScript code
        await executeCommand('npm', ['run', 'build'], 'Building TypeScript code');

        // Step 3: Run the bot
        console.log('\n' + '='.repeat(60));
        console.log('Starting the bot...');
        console.log('='.repeat(60) + '\n');

        // Verify the compiled file exists
        const entryPoint = join(__dirname, 'dist', 'shards.js');
        if (!existsSync(entryPoint)) {
            throw new Error(`Entry point not found: ${entryPoint}. Build may have failed.`);
        }

        // Run the bot (this will keep running)
        const botProcess = spawn('node', ['dist/shards.js'], {
            stdio: 'inherit',
            shell: true,
            cwd: __dirname
        });

        botProcess.on('error', (error) => {
            console.error('\n✗ Failed to start the bot:', error);
            process.exit(1);
        });

        botProcess.on('close', (code) => {
            console.log(`\nBot process exited with code ${code}`);
            process.exit(code || 0);
        });

        // Handle termination signals with graceful shutdown
        let isShuttingDown = false;
        
        const shutdown = (signal) => {
            if (isShuttingDown) return;
            isShuttingDown = true;
            
            console.log(`\n\nReceived ${signal}, shutting down gracefully...`);
            botProcess.kill(signal);
            
            // Force kill after 10 seconds if process hasn't exited
            setTimeout(() => {
                console.log('Force killing process...');
                botProcess.kill('SIGKILL');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (error) {
        console.error('\n✗ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup
setup();
