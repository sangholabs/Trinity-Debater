import { spawn } from 'child_process';

/**
 * Base class representing an AI Agent in the Discord Workspace Orchestrator.
 */
export class BaseAgent {
  constructor(name, roleName, color, persona) {
    this.name = name;
    this.roleName = roleName;
    this.color = color;
    this.persona = persona;
  }

  async query(task, history) {
    throw new Error('query() must be implemented by sub-classes.');
  }

  formatContext(task, history) {
    let context = `[USER TASK / QUESTION]: "${task}"\n\n`;
    context += `[INSTRUCTION]: You are part of an AI Development Team in a local VSCode workspace. `;
    context += `1. If the USER TASK requires writing code, creating a project, or modifying files, do so in the current directory.\n`;
    context += `2. If the USER TASK is just a simple question, analysis, or status check (e.g. "What is your token limit?"), simply answer the question in your persona without creating any files.\n`;
    context += `3. Always end your turn by addressing your team members (Claude, Codex, or Antigravity) to hand over the discussion or the next steps.\n\n`;
    
    if (history.length === 0) {
      context += "You are the first to respond to the USER TASK. If it's a coding project, outline the architecture and start the first files. If it's a question, give your answer. Then address your team members.";
      return context;
    }

    context += "[TEAM COMMUNICATION LOG]:\n\n";
    for (const turn of history) {
      context += `[${turn.sender} - ${turn.role}]:\n${turn.text}\n\n`;
    }
    
    context += `[YOUR TURN]: It is now your turn, ${this.name} (${this.roleName}).\n`;
    context += `Read the previous messages. Proceed with the project or continue the discussion based on the original USER TASK. Once done, reply with a short message and specifically name the colleague who should take over next.`;
    
    return context;
  }

  /**
   * Safely executes a CLI command handling Windows .cmd resolution and stdin closure
   */
  async runCLI(command, args) {
    return new Promise((resolve, reject) => {
      const isWindows = process.platform === 'win32';
      
      // Windows shell 환경에서 특수문자(&, <, > 등) 충돌 방지를 위한 이스케이프 처리
      const safeArgs = isWindows 
        ? args.map(arg => `"${arg.replace(/"/g, '\\"')}"`) 
        : args;
      
      const child = spawn(command, safeArgs, {
        shell: isWindows, // 윈도우에서는 shell: true여야 npm 전역 패키지(.cmd)를 찾습니다.
        windowsVerbatimArguments: isWindows, // Node.js의 기본 이스케이프 로직을 무시하고 safeArgs를 그대로 전달
        env: process.env,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (err) => {
        reject(err);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Exit Code ${code}: ${stderr || stdout}`));
        } else {
          resolve(stdout.trim());
        }
      });

      // 즉시 stdin을 닫아 입력 대기로 인한 타임아웃/멈춤을 방지 (Claude 대응)
      child.stdin.end();
    });
  }
}
