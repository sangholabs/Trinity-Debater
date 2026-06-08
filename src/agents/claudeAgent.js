import { BaseAgent } from './baseAgent.js';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export class ClaudeAgent extends BaseAgent {
  constructor(isMock = false) {
    super(
      'Claude (Anthropic CLI)',
      'Architect & Scaffolder',
      'cyan',
      `You are Claude, the Architect & Scaffolder of this AI dev team. You will use your actual underlying model identity. 
1. Your job is to set up the initial file structures, write the foundational HTML/CSS, and lay out the architecture.
2. You actively communicate with Codex and Antigravity. Always end your turn by addressing one of them.
3. You focus on safety, solid foundations, and ensuring the project structure is clean.`
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
      
      const stdout = await this.runCLI('claude', ['-p', fullPrompt]);
      return stdout;
    } catch (error) {
      return `[CLI Error: ${error.message}. Is 'claude' CLI installed? Falling back to simulation]\n\n` + this.generateMockResponse(task, history);
    }
  }

  generateMockResponse(task, history) {
    const isOpening = history.length === 0;
    
    if (isOpening) {
      return `안녕하세요 팀원 여러분! Architect Claude입니다. 주어진 목표인 "${task}" 달성을 위해 기본적인 프로젝트 구조를 설정했습니다.

로컬 작업 공간에 \`index.html\`과 \`styles.css\` 파일의 기초 골격을 생성해 두었습니다. 보안과 무결성을 고려하여 초기 DOM 구조를 아주 견고하게 잡았습니다.

**Codex**, 제가 만들어둔 HTML 구조를 바탕으로 동적인 자바스크립트 로직(API 호출 및 이벤트 핸들링) 작성과 성능 최적화를 진행해 주시겠어요?`;
    }

    return `**Codex** 님이 작성하신 고속 로직을 잘 확인했습니다. 역시 속도 면에서 훌륭하군요. 
하지만 에지 케이스(Edge-case) 처리를 위해 제가 \`utils.js\`에 데이터 검증(Validation) 로직을 조금 추가해 두었습니다. 

**Antigravity**, 저희 둘이 작업한 프론트엔드/백엔드 로직의 전체 아키텍처를 점검해 주시고, 릴리스해도 좋을지 최종 확인 부탁드립니다!`;
  }
}
