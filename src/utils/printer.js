import chalk from 'chalk';
import boxen from 'boxen';
import fs from 'fs';
import path from 'path';

/**
 * Prints the stylized header for an agent's turn.
 * @param {object} agent - The agent details (name, roleName, color).
 */
export function printAgentHeader(agent) {
  const colorFn = chalk[agent.color] || chalk.white;
  const headerText = colorFn.bold(`${agent.name.toUpperCase()} • ${agent.roleName.toUpperCase()}`);
  
  console.log('\n' + boxen(headerText, {
    padding: 0,
    margin: { left: 1 },
    borderStyle: 'singleDouble',
    borderColor: agent.color,
    dimBorder: true
  }));
}

/**
 * Prints an agent's response text inside a beautiful terminal box.
 * @param {string} text - Response text.
 * @param {string} color - The theme color name.
 */
export function printAgentResponse(text, color) {
  const colorFn = chalk[color] || chalk.white;
  
  // Format code blocks slightly differently to make them pop in terminal
  const formattedText = text.replace(/```(\w+)?([\s\S]*?)```/g, (match, lang, code) => {
    return chalk.bgGray.black(` [Code Block: ${lang || 'text'}] `) + '\n' + chalk.dim(code.trim());
  });

  console.log(boxen(formattedText, {
    padding: 1,
    margin: { left: 2, right: 2, bottom: 1 },
    borderStyle: 'round',
    borderColor: color,
    title: 'Statement',
    titleAlignment: 'left'
  }));
}

/**
 * Prints standard system alerts or headings.
 * @param {string} text - Message text.
 */
export function printSystemMessage(text) {
  console.log(chalk.bold.green(`\n[System] ${text}`));
}

/**
 * Saves the debate history as a beautiful markdown file in the workspace.
 * @param {string} topic - The debate topic.
 * @param {Array} history - Complete debate history.
 * @param {string} customPath - Optional custom path to save.
 * @returns {string} - The path where the file was saved.
 */
export function saveTranscript(topic, history, customPath) {
  const filename = `debate_${topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
  const targetDir = customPath ? path.dirname(customPath) : process.cwd();
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const finalPath = customPath || path.join(targetDir, filename);

  let mdContent = `# Multi-Agent Relay Debate Transcript\n\n`;
  mdContent += `> **Topic**: ${topic}\n`;
  mdContent += `> **Date**: ${new Date().toLocaleString()}\n`;
  mdContent += `> **Participants**: Claude 3.5 Sonnet, Codex (GPT-4o), Antigravity (Gemini)\n\n`;
  
  mdContent += `## Table of Contents\n`;
  history.forEach((turn, idx) => {
    mdContent += `${idx + 1}. [Round ${turn.round}] [${turn.sender} - ${turn.role}](#${turn.sender.toLowerCase().replace(/[^a-z0-9]+/g, '-')})\n`;
  });
  mdContent += `\n---\n\n`;

  history.forEach((turn) => {
    const isConsensus = turn.sender === 'Collaborative Consensus';
    const alertType = isConsensus ? 'TIP' : turn.sender.includes('Claude') ? 'NOTE' : turn.sender.includes('Codex') ? 'IMPORTANT' : 'WARNING';
    
    mdContent += `### <a name="${turn.sender.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"></a>${turn.sender} (${turn.role}) - Round ${turn.round}\n\n`;
    mdContent += `> [!${alertType}]\n`;
    mdContent += `> **${turn.role}**'s statement on this round.\n\n`;
    
    // Indent the text to sit beautifully inside blockquotes
    const indentedText = turn.text.split('\n').map(line => `> ${line}`).join('\n');
    mdContent += indentedText + `\n\n`;
    mdContent += `\n---\n\n`;
  });

  mdContent += `### About the Models\n`;
  mdContent += `*   **Claude 3.5 Sonnet**: Emulated as a highly rigorous safety critic, analyzing edge cases and validation safety.\n`;
  mdContent += `*   **Codex (GPT-4o)**: Emulated as a high-velocity pragmatic developer focused on execution speed and simplicity.\n`;
  mdContent += `*   **Antigravity (Gemini)**: Emulated as a visionary architect synthesizing trade-offs into pure clean code architectures.\n`;

  fs.writeFileSync(finalPath, mdContent, 'utf8');
  return finalPath;
}
