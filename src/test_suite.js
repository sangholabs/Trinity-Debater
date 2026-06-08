import assert from 'assert';
import { ClaudeAgent } from './agents/claudeAgent.js';
import { CodexAgent } from './agents/codexAgent.js';
import { AntigravityAgent } from './agents/antigravityAgent.js';
import { DebateOrchestrator } from './core/orchestrator.js';
import * as printer from './utils/printer.js';

console.log('--- STARTING CLI VERIFICATION TEST SUITE ---');

try {
  // 1. Verify Agents Load & Construct
  console.log('Testing Agent initializations...');
  const claude = new ClaudeAgent(true);
  const codex = new CodexAgent(true);
  const gemini = new AntigravityAgent(true);

  assert.strictEqual(claude.name, 'Claude 3.5 Sonnet');
  assert.strictEqual(codex.name, 'Codex (GPT-4o)');
  assert.strictEqual(gemini.name, 'Antigravity (Gemini)');
  console.log('✓ All 3 Agent adapters initialized and named successfully.');

  // 2. Verify Persona settings
  assert.ok(claude.persona.includes('Critic'));
  assert.ok(codex.persona.includes('Pragmatic'));
  assert.ok(gemini.persona.includes('Architect'));
  console.log('✓ Agent system personas loaded correctly.');

  // 3. Verify Mock response outputs
  console.log('Testing Mock statement generation...');
  const opStatement = claude.generateMockResponse('Monorepos vs Polyrepos', []);
  assert.ok(opStatement.includes('Critic'));
  assert.ok(opStatement.includes('TypeScript') || opStatement.includes('class') || opStatement.includes('SecureProcessor'));

  const history = [{ sender: 'Claude 3.5 Sonnet', role: 'Technical Critic', text: opStatement }];
  const responseStatement = codex.generateMockResponse('Monorepos vs Polyrepos', history);
  assert.ok(responseStatement.includes('velocity'));
  assert.ok(responseStatement.includes('boilerplate') || responseStatement.includes('premature') || responseStatement.includes('concurrency'));
  console.log('✓ Agent simulated responses match specified personas and histories.');

  // 4. Verify Orchestrator loading
  console.log('Testing Orchestrator initialization...');
  const orch = new DebateOrchestrator({ topic: 'REST vs GraphQL', rounds: 1, isMock: true });
  assert.strictEqual(orch.rounds, 1);
  assert.strictEqual(orch.isMock, true);
  assert.strictEqual(orch.agents.length, 3);
  console.log('✓ Debate Orchestrator initialized correctly.');

  // 5. Verify Logger saving capability
  console.log('Testing Markdown file compiler...');
  const dummyHistory = [
    { sender: 'Claude 3.5 Sonnet', role: 'Critic', text: 'Statement A', round: 1 },
    { sender: 'Codex (GPT-4o)', role: 'Optimizer', text: 'Statement B', round: 1 },
    { sender: 'Antigravity (Gemini)', role: 'Architect', text: 'Statement C', round: 1 },
    { sender: 'Collaborative Consensus', role: 'Synthesized Architecture', text: 'Statement D', round: 'Synthesis' }
  ];
  const testPath = './debate_test_suite_log.md';
  const savedPath = printer.saveTranscript('Test Topic Suite', dummyHistory, testPath);
  assert.ok(savedPath.includes('debate_test_suite_log.md'));
  console.log('✓ Markdown compiler generated report successfully.');

  console.log('--- ALL CLI MODULE VERIFICATIONS PASSED ---');
  process.exit(0);
} catch (error) {
  console.error('✗ CLI VERIFICATION TEST FAILED:', error);
  process.exit(1);
}
