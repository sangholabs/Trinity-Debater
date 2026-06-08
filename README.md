# 🤖 Trinity-Debater

<div align="center">
  <p><strong>A powerful Discord orchestration tool for a Multi-Agent AI Dev Team</strong></p>
  <p><i>(Claude Code, OpenAI Codex, and Antigravity)</i></p>
</div>

---

## 🇰🇷 한국어 가이드 (Korean)

Trinity-Debater는 사용자의 로컬 VSCode 작업 환경 내에서 3명의 강력한 AI CLI 에이전트(Claude, Codex, Antigravity)를 디스코드 채널로 묶어주는 **다중 에이전트 오케스트레이터**입니다.

이 프로젝트를 실행하면, 디스코드 채널이 당신의 AI 개발팀 회의실이 됩니다. 당신이 목표를 지시하면, 3명의 에이전트가 로컬 폴더에 직접 파일(HTML, CSS, JS 등)을 생성하며 서로 코드를 리뷰하고 릴레이로 프로젝트를 완성합니다.

### 🌟 주요 기능 (Features)
* **로컬 파일 직접 제어 (Local File Execution)**: 봇이 터미널의 권한을 상속받아, 3개의 CLI 명령어를 백그라운드에서 직접 실행하고 로컬 파일을 조작합니다.
* **디스코드 실시간 중계 (Discord Orchestration)**: 각 에이전트가 어떤 파일을 수정했고, 동료에게 어떤 피드백을 남겼는지 디스코드 채널에 실시간 Embed 메시지로 중계됩니다.
* **유연한 대화 엔진 (Flexible Contexting)**: 이전 에이전트의 대화 내역이 다음 에이전트의 CLI 프롬프트에 자동으로 주입되어 자연스러운 릴레이 토론이 이루어집니다.
* **안전한 실행 래퍼 (Safe Windows Execution)**: Windows 환경에서의 npm 전역 스크립트 특수문자 충돌을 방지하는 특수 쉘 이스케이프 파이프라인이 탑재되어 있습니다.

### ⚙️ 필수 사전 준비물 (Prerequisites)
1. **Node.js** (v18 이상 권장)
2. **Claude Code CLI**: `npm install -g @anthropic-ai/claude-code` 설치 후 터미널에서 `claude login` 완료
3. **OpenAI Codex CLI**: `npm install -g @openai/codex` 설치 (및 OpenAI API Key 준비 또는 `codex login`)
4. **Antigravity CLI**: 로컬 설정에 따른 Antigravity 구동 환경 (또는 Gemini CLI 등 호환 가능)
5. **Discord Bot Token**: 디스코드 개발자 포털에서 발급받은 봇 토큰 (Intents: `MessageContent` 활성화 필수)

### 🚀 설치 및 실행 방법 (How to Start)
1. 레포지토리를 다운로드(Clone) 합니다.
2. 터미널에서 프로젝트 폴더로 이동하여 패키지를 설치합니다:
   ```bash
   npm install
   ```
3. `.env.example` 파일의 이름을 `.env`로 변경하고, 발급받은 디스코드 토큰을 입력합니다. (API 키는 CLI의 자체 로그인을 사용하므로 적지 않으셔도 됩니다.)
   ```env
   DISCORD_TOKEN=당신의_디스코드_봇_토큰을_여기에_넣으세요
   ```
4. 디스코드 봇 서버를 실행합니다! (봇 서버 역할을 하는 이 터미널 창은 계속 켜두셔야 합니다.)
   ```bash
   npm run start:bot
   ```
5. 디스코드 채널로 돌아가서 `!task 반응형 대시보드를 만들어줘` 라고 입력하면 AI 팀이 즉시 작업을 시작합니다!

---

## 🇺🇸 English Guide

**Trinity-Debater** is a multi-agent orchestrator that connects three powerful AI CLI agents (Claude Code, OpenAI Codex, and Antigravity) into a unified Discord channel running inside your local VSCode workspace.

By running this project, your Discord channel transforms into an AI Dev Team meeting room. When you give a directive, the three agents actively scaffold files (HTML, CSS, JS, etc.) in your local directory, review each other's code, and complete the project through a relay debate.

### 🌟 Features
* **Local File Execution**: The bot inherits terminal permissions, seamlessly executing three CLI commands in the background to manipulate local files directly.
* **Real-time Discord Orchestration**: Agents' actions, file modifications, and feedback to colleagues are broadcast in real-time to your Discord channel via Embed messages.
* **Flexible Context Engine**: Conversation history from previous agents is automatically injected into the next agent's CLI prompt, enabling organic relay discussions.
* **Safe Windows Execution Wrapper**: Includes a specialized shell escape pipeline to prevent special character conflicts with npm global scripts in Windows environments.

### ⚙️ Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **Claude Code CLI**: Run `npm install -g @anthropic-ai/claude-code` and complete `claude login` in the terminal.
3. **OpenAI Codex CLI**: Run `npm install -g @openai/codex` (Ensure you have credits or ran `codex login`).
4. **Antigravity CLI**: A working local environment for Antigravity (or Gemini CLI if compatible).
5. **Discord Bot Token**: A token from the Discord Developer Portal (Must have `MessageContent` intent enabled).

### 🚀 How to Start
1. Clone the repository.
2. Navigate to the project folder and install dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.example` to `.env` and insert your Discord Bot Token. (You do not need to add API keys here; the bot relies on your native CLI authentications.)
   ```env
   DISCORD_TOKEN=insert_your_discord_bot_token_here
   ```
4. Start the Discord Bot Server! (Keep this terminal running to keep the bot online.)
   ```bash
   npm run start:bot
   ```
5. Go to your Discord channel and type `!task Build a responsive dashboard`, and watch your AI team get to work!
