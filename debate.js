#!/usr/bin/env node

import minimist from 'minimist';
import chalk from 'chalk';
import boxen from 'boxen';
import { exec } from 'child_process';
import { promisify } from 'util';
import { DebateOrchestrator } from './src/core/orchestrator.js';
import { saveTranscript } from './src/utils/printer.js';

const execAsync = promisify(exec);

// Parse CLI Arguments
const argv = minimist(process.argv.slice(2), {
  string: ['topic', 'output'],
  number: ['rounds'],
  boolean: ['mock', 'help'],
  alias: {
    t: 'topic',
    r: 'rounds',
    o: 'output',
    m: 'mock',
    h: 'help'
  },
  default: {
    rounds: 2,
    mock: false,
    help: false
  }
});

// Help command display
if (argv.help) {
  const helpText = `
${chalk.bold.magenta('Multi-Agent Relay Debate CLI')}
Orchestrate a high-quality debate between Claude, Codex, and Antigravity via their native CLIs.

${chalk.bold('Usage:')}
  node debate.js [options]

${chalk.bold('Options:')}
  -t, --topic "${chalk.dim('topic')}"      The technical debate topic.
  -r, --rounds ${chalk.dim('N')}           Number of debate rounds (default: 2)
  -o, --output ${chalk.dim('path')}        Custom file path to save the markdown transcript.
  -m, --mock             Run in simulated/mock mode (requires zero installed CLIs).
  -h, --help             Show this help information.
`;
  console.log(boxen(helpText, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'magenta',
    title: 'CLI GUIDE'
  }));
  process.exit(0);
}

const topic = argv.topic || 'Should we use SQL or NoSQL databases for microservices?';
const rounds = argv.rounds;
const isMock = argv.mock;
const outputCustomPath = argv.output;

async function checkCLI(command) {
  try {
    if (process.platform === 'win32') {
      await execAsync(`where ${command}`);
    } else {
      await execAsync(`which ${command}`);
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.clear();
  
  const titleCard = `
${chalk.bold.magenta('   ___         _   _                                _ _       _  ')}
${chalk.bold.cyan('  / _ \\  _ __ | |_(_) __ _ _ __ __ ___   __(_) |_ _   _  ')}
${chalk.bold.yellow(' / /_\\ \\| \'_ \\| __| |/ _` | \'__/ _` \\ \\ / / | __| | | | ')}
${chalk.bold.magenta('/ /_\\\\ \\| | | | |_| | (_| | | | (_| |\\ V /| | |_| |_| | ')}
${chalk.bold.cyan('\\____/\\_|_| |_|\\__|_|\\__, |_|  \\__,_| \\_/ |_|\\__|\\__, | ')}
${chalk.bold.yellow('                     |___/                       |___/  ')}
\n   ${chalk.bold.italic.white('Multi-Agent Relay Debate Engine: Claude vs Codex vs Antigravity')}
  `;
  
  console.log(titleCard);

  let actualMock = isMock;
  
  if (!isMock) {
    console.log(chalk.dim('Verifying CLI dependencies...'));
    const hasClaude = await checkCLI('claude');
    const hasGh = await checkCLI('gh');
    const hasGemini = await checkCLI('gemini');

    if (!hasClaude || !hasGh || !hasGemini) {
      console.log(chalk.yellow(`\n[Info] Native CLI tools are missing. Falling back to MOCK/SIMULATION mode.`));
      console.log(chalk.dim(`Please install the required CLIs to run live:`));
      if (!hasClaude) console.log(chalk.cyan(`  - Claude Code: npm install -g @anthropic-ai/claude-code`));
      if (!hasGh) console.log(chalk.yellow(`  - Codex (Copilot): Install GitHub CLI, then: gh extension install github/gh-copilot`));
      if (!hasGemini) console.log(chalk.magenta(`  - Gemini CLI: npm install -g @google/gemini-cli`));
      actualMock = true;
    } else {
      console.log(chalk.green('✓ All CLIs found! Launching live debate.'));
    }
  }

  const orchestrator = new DebateOrchestrator({ topic, rounds, isMock: actualMock });

  try {
    const history = await orchestrator.run();
    console.log(chalk.bold.green('\n[Success] Debate completed successfully!'));
    const savedPath = saveTranscript(topic, history, outputCustomPath);
    
    const finalReportBox = `
${chalk.bold.green('Debate Transcript Logged!')}
The complete debate transcript has been successfully written to:
📁 ${chalk.bold.cyan(savedPath)}
    `;
    
    console.log(boxen(finalReportBox, {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'double',
      borderColor: 'green',
      title: 'TRANSCRIPT LOGGED'
    }));
  } catch (error) {
    console.error(chalk.bold.red(`\n[Fatal Error] The debate execution halted unexpectedly:`), error);
    process.exit(1);
  }
}

main();
