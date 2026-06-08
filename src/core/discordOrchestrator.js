import { EmbedBuilder } from 'discord.js';
import { ClaudeAgent } from '../agents/claudeAgent.js';
import { CodexAgent } from '../agents/codexAgent.js';
import { AntigravityAgent } from '../agents/antigravityAgent.js';

export class DiscordOrchestrator {
  constructor(interaction, topic, rounds, isMock = false) {
    this.interaction = interaction;
    this.topic = topic;
    this.rounds = rounds;
    
    // Initialize Agents
    this.agents = [
      new ClaudeAgent(isMock),
      new CodexAgent(isMock),
      new AntigravityAgent(isMock)
    ];
    
    this.history = [];
  }

  async run() {
    let currentAgentIndex = 0;
    
    for (let round = 1; round <= this.rounds; round++) {
      for (let i = 0; i < this.agents.length; i++) {
        const agent = this.agents[currentAgentIndex];
        
        // Notify Discord that the agent is thinking/working
        const pendingEmbed = new EmbedBuilder()
          .setColor(agent.color.toUpperCase() === 'CYAN' ? '#00FFFF' : agent.color.toUpperCase() === 'YELLOW' ? '#FFFF00' : '#FF00FF')
          .setTitle(`[로컬 작업 진행 중] ${agent.name}`)
          .setDescription(`파일을 수정하고 동료들의 메시지를 읽고 있습니다...`);
        
        const statusMessage = await this.interaction.channel.send({ embeds: [pendingEmbed] });

        try {
          // Execute the agent CLI, passing the history so they can communicate
          const response = await agent.query(this.topic, this.history);
          
          this.history.push({
            role: agent.roleName,
            sender: agent.name,
            text: response
          });

          // Discord Embed Description 글자 수 제한(4096자) 방지
          const safeResponse = response.length > 4000 
            ? response.substring(0, 4000) + '\n\n...[응답이 너무 길어 생략되었습니다. 로컬 파일을 확인하세요!]' 
            : response;

          // Update Discord with the agent's actual response/action
          const successEmbed = new EmbedBuilder()
            .setColor(agent.color.toUpperCase() === 'CYAN' ? '#00FFFF' : agent.color.toUpperCase() === 'YELLOW' ? '#FFFF00' : '#FF00FF')
            .setTitle(`[작업 완료] ${agent.name} (${agent.roleName})`)
            .setDescription(safeResponse)
            .setFooter({ text: `Round ${round}/${this.rounds}` });
            
          await statusMessage.edit({ embeds: [successEmbed] });

        } catch (error) {
          const errorEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`[오류 발생] ${agent.name}`)
            .setDescription(`CLI 프로세스 실행 중 오류가 발생했습니다: \n\`\`\`\n${error.message}\n\`\`\``);
            
          await statusMessage.edit({ embeds: [errorEmbed] });
          throw error;
        }

        // Pass baton to next agent
        currentAgentIndex = (currentAgentIndex + 1) % this.agents.length;
      }
    }

    // Final synthesis wrap up
    const finalEmbed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ 릴레이 협업 완료')
      .setDescription(`모든 에이전트의 작업이 완료되었습니다. 로컬 폴더를 확인해 주세요!`);
      
    await this.interaction.channel.send({ embeds: [finalEmbed] });
    return this.history;
  }
}
