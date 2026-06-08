import { Client, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { DiscordOrchestrator } from './src/core/discordOrchestrator.js';
import chalk from 'chalk';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const PREFIX = '!task';

client.once('ready', () => {
  console.log(chalk.green(`\n[Discord] 봇이 성공적으로 로그인되었습니다: ${client.user.tag}`));
  console.log(chalk.cyan(`[로컬 작업 공간 연결됨] 작업 준비 완료.`));
  console.log(chalk.yellow(`디스코드 채널에서 '!task [주제]' 명령어를 입력하여 AI 개발팀을 호출하세요.\n`));
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const topic = message.content.slice(PREFIX.length).trim();

    if (!topic) {
      return message.reply('명령어 형식이 잘못되었습니다. 사용법: `!task [지시할 내용]`');
    }

    const startEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🚀 AI 개발팀 작업 시작')
      .setDescription(`**작업 목표**: ${topic}\n\n로컬 작업 공간에서 Claude, Codex, Antigravity가 협업을 시작합니다...`);

    await message.channel.send({ embeds: [startEmbed] });

    try {
      // 2 라운드로 설정. 실제 CLI 환경(isMock = false)으로 실행하여 진짜 파일을 생성하도록 설정!
      const orchestrator = new DiscordOrchestrator(message, topic, 2, false); 
      await orchestrator.run();
    } catch (error) {
      console.error(error);
      message.reply(`❌ 작업 중 치명적인 오류가 발생했습니다: ${error.message}`);
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token || token === 'your_discord_bot_token_here') {
  console.error(chalk.red('\n[오류] .env 파일에 유효한 DISCORD_TOKEN이 설정되지 않았습니다.'));
  process.exit(1);
}

client.login(token);
