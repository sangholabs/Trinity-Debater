import ora from 'ora';
import { ClaudeAgent } from '../agents/claudeAgent.js';
import { CodexAgent } from '../agents/codexAgent.js';
import { AntigravityAgent } from '../agents/antigravityAgent.js';
import { printAgentHeader, printAgentResponse, printSystemMessage } from '../utils/printer.js';

export class DebateOrchestrator {
  /**
   * @param {object} options
   * @param {string} options.topic - Debate topic
   * @param {number} options.rounds - Number of rounds (default 2)
   * @param {boolean} options.isMock - Whether to run in simulated mode
   */
  constructor({ topic, rounds = 2, isMock = false }) {
    this.topic = topic;
    this.rounds = rounds;
    this.isMock = isMock;
    this.history = [];

    // Initialize agent adapters
    this.agents = [
      new ClaudeAgent(isMock),
      new CodexAgent(isMock),
      new AntigravityAgent(isMock)
    ];
  }

  /**
   * Runs the entire relay debate.
   * @returns {Promise<Array>} - The complete debate history.
   */
  async run() {
    printSystemMessage(`Initiating Relay Debate on topic: "${this.topic}" (${this.rounds} Rounds)...`);

    for (let round = 1; round <= this.rounds; round++) {
      printSystemMessage(`--- ROUND ${round} ---`);

      for (const agent of this.agents) {
        // 1. Show dynamic loader spinner
        const spinner = ora({
          text: `Querying ${agent.name} (${agent.roleName})...`,
          color: agent.color === 'magenta' ? 'magenta' : agent.color === 'cyan' ? 'cyan' : 'yellow'
        }).start();

        const startTime = Date.now();
        let responseText = '';
        
        try {
          // 2. Query the agent
          responseText = await agent.query(this.topic, this.history);
          spinner.succeed(`${agent.name} finished in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
        } catch (error) {
          spinner.fail(`${agent.name} encountered an error: ${error.message}`);
          responseText = `[Could not complete statement due to error: ${error.message}]`;
        }

        // 3. Render the output inside a gorgeous terminal card
        printAgentHeader(agent);
        printAgentResponse(responseText, agent.color);

        // 4. Push to history
        this.history.push({
          sender: agent.name,
          role: agent.roleName,
          text: responseText,
          round: round
        });

        // Add brief human-like pause for readability
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Run Final Synthesis Round
    await this.runSynthesis();

    return this.history;
  }

  /**
   * Runs the final synthesis round where the models reach a consensus.
   */
  async runSynthesis() {
    printSystemMessage('--- FINAL SYNTHESIS & CONSENSUS ---');
    
    // Antigravity (Gemini) acts as the final synthesizer
    const synthesizer = this.agents.find(a => a.name.includes('Antigravity')) || this.agents[2];
    
    const spinner = ora({
      text: `Drafting collaborative synthesis with ${synthesizer.name}...`,
      color: 'magenta'
    }).start();

    const startTime = Date.now();
    let synthesisText = '';

    try {
      const synthesisPrompt = `You are running the FINAL SYNTHESIS turn of the debate. 
Read the entire debate history. Deliver a highly polished "Unified Consensus". 
Acknowledge the core contributions of Claude (safety/robustness) and Codex (speed/simplicity). 
Provide a clear, final hybrid architecture or set of best practices that perfectly merges their insights. 
Summarize this into a concise set of golden rules for developers.`;
      
      // Temporarily push the special synthesis instruction to history
      const tempHistory = [...this.history, {
        sender: 'System Instruction',
        role: 'Orchestrator',
        text: synthesisPrompt
      }];

      synthesisText = await synthesizer.query(this.topic, tempHistory);
      spinner.succeed(`Synthesis finished in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
    } catch (error) {
      spinner.fail(`Failed to compile synthesis: ${error.message}`);
      synthesisText = `[Could not complete synthesis due to error: ${error.message}]`;
    }

    printAgentHeader({ name: 'COLLABORATIVE CONSENSUS', roleName: 'Synthesized Architecture', color: 'green' });
    printAgentResponse(synthesisText, 'green');

    this.history.push({
      sender: 'Collaborative Consensus',
      role: 'Synthesized Architecture',
      text: synthesisText,
      round: 'Synthesis'
    });
  }
}
