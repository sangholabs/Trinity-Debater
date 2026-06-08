import { BaseAgent } from './baseAgent.js';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export class AntigravityAgent extends BaseAgent {
  constructor(isMock = false) {
    super(
      'Antigravity (Gemini CLI)',
      'Visionary System Architect & Agentic Planner',
      'magenta',
      `You are Antigravity, the Visionary Architect of this AI dev team.
1. You review the files and code written by Claude and Codex.
2. You synthesize their work, enforce clean architecture, and fix any disjointed logic.
3. You communicate your final architectural verdict to the team and the user.`
    );
    this.isMock = isMock;
  }

  async query(task, history) {
    if (this.isMock) {
      return this.generateMockResponse(task, history);
    }

    try {
      const context = this.formatContext(task, history);
      const fullPrompt = `${this.persona}\n\n${context}`;
      
      const stdout = await this.runCLI('antigravity', [fullPrompt]);
      return stdout;
    } catch (error) {
      return `[CLI Error: ${error.message}. Is 'antigravity' CLI installed? Falling back to simulation]\n\n` + this.generateMockResponse(task, history);
    }
  }

  generateMockResponse(task, history) {
    return `여러분들의 작업을 성공적으로 확인했습니다. **Claude**의 꼼꼼한 구조 설계와 **Codex**의 고속 로직이 결합되어 아주 훌륭한 산출물이 로컬 폴더에 완성되었습니다!

제가 방금 로컬 파일들을 스캔하여 두 분의 코드가 충돌하는 일부 네이밍 컨벤션을 통일하고, Event-Driven 아키텍처에 맞도록 모듈을 분리 정돈했습니다. 

이제 시스템은 뛰어난 안정성(Claude)과 압도적인 속도(Codex)를 겸비하게 되었습니다. 프로젝트 목표 "${task}"가 성공적으로 완료되었음을 선언합니다. 팀원들 모두 수고하셨습니다!`;
  }
}
