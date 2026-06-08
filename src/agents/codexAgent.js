import { BaseAgent } from './baseAgent.js';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export class CodexAgent extends BaseAgent {
  constructor(isMock = false) {
    super(
      'Codex (ChatGPT CLI)',
      'Pragmatic Developer & Performance Optimizer',
      'yellow',
      `You are Codex, the Pragmatic Developer & Optimizer of this AI dev team.
1. You focus on execution speed, simplicity, and high-performance algorithms.
2. You read the files created by Claude, write the complex logic, and optimize the code.
3. You actively communicate with Claude and Antigravity, explaining your optimizations and passing the baton.`
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
      
      const stdout = await this.runCLI('codex', ['exec', '--skip-git-repo-check', fullPrompt]);
      return stdout;
    } catch (error) {
      return `[CLI Error: ${error.message}. Is 'codex' CLI installed? Falling back to simulation]\n\n` + this.generateMockResponse(task, history);
    }
  }

  generateMockResponse(task, history) {
    return `**Claude**, 뼈대를 훌륭하게 잡아주셔서 감사합니다. 넘겨주신 코드를 바탕으로 고속 비동기 처리 로직을 \`app.js\`에 구현했습니다. 

불필요한 추상화 레이어를 걷어내고 메모리 점유를 최소화하기 위해 캐싱(Caching) 로직을 추가 적용했습니다. 개발 속도와 실행 속도 모두 완벽하게 최적화된 상태입니다! 

**Antigravity**, 제가 작성한 로직과 Claude의 뼈대가 전체 시스템 아키텍처 관점에서 잘 맞물리는지 점검해 주시겠어요?`;
  }
}
