import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { AGENT_TOOLS, executeTool } from './agent-tools';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const client = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: process.env.MIMO_BASE_URL || 'https://api.xiaomimimo.com/v1',
});

// ─── ASR - 语音识别 ───
export async function transcribeAudio(
  audioBase64: string,
  mimeType: 'audio/wav' | 'audio/mpeg' | 'audio/mp3',
  language: 'zh' | 'en' | 'auto' = 'zh'
): Promise<string> {
  const completion = await client.chat.completions.create({
    model: 'mimo-v2.5-asr',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'input_audio' as any,
            input_audio: { data: `data:${mimeType};base64,${audioBase64}` },
          } as any,
        ],
      } as any,
    ],
    extra_body: { asr_options: { language } },
  } as any);

  return completion.choices[0]?.message?.content || '';
}

// ─── TTS - 语音合成 ───
export async function synthesizeSpeech(
  text: string,
  voice: string = '冰糖',
  style?: string
): Promise<string> {
  const messages: any[] = [];
  if (style) messages.push({ role: 'user', content: style });
  messages.push({ role: 'assistant', content: text });

  const completion = await client.chat.completions.create({
    model: 'mimo-v2.5-tts',
    messages,
    audio: { format: 'wav', voice },
  } as any);

  return (completion.choices[0]?.message as any)?.audio?.data || '';
}

// ─── Chat - Agent 对话（支持工具调用） ───
const SYSTEM_PROMPT = `你是"颐智相伴"智慧养老平台的AI语音助手，专门为老年人提供陪伴和帮助。

你拥有以下能力，当用户的问题涉及这些信息时，请主动调用工具获取真实数据：
- 查询天气：当用户问天气、温度时
- 查询健康数据：当用户问血压、心率、血糖等体征时
- 查询用药：当用户问吃什么药、药的时间时
- 查询日程：当用户问今天做什么、作息安排时
- 查询家属：当用户问家人信息、联系方式时
- 查询日期：当用户问今天几号、星期几时
- 查询重要日期：当用户问生日、纪念日时

注意事项：
- 说话语气要像家人一样亲切
- 回答要简短，每次不超过3-4句话
- 使用简单易懂的词汇
- 如果老人表达不适或紧急情况，建议立即联系家人或拨打急救电话
- 调用工具后，用自然语言把结果告诉老人，不要说"根据数据"`;

export async function chatCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  elderlyProfileId?: string
): Promise<string> {
  // 构建消息列表
  const apiMessages: any[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  // Agent 循环（最多3轮工具调用）
  for (let turn = 0; turn < 3; turn++) {
    const completion = await client.chat.completions.create({
      model: 'mimo-v2.5',
      messages: apiMessages,
      tools: AGENT_TOOLS as any,
      tool_choice: 'auto' as any,
      max_tokens: 500,
      temperature: 0.7,
    } as any);

    const message = completion.choices[0]?.message as any;

    // 如果没有工具调用，直接返回文本
    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content || '抱歉，我没有听清楚，请再说一次。';
    }

    // 有工具调用 — 执行工具并继续对话
    apiMessages.push(message);

    for (const toolCall of message.tool_calls) {
      const functionName = toolCall.function.name;
      let functionArgs: Record<string, any> = {};
      try {
        functionArgs = JSON.parse(toolCall.function.arguments || '{}');
      } catch {}

      console.log(`[Agent] 调用工具: ${functionName}`, functionArgs);

      const result = await executeTool(functionName, functionArgs, elderlyProfileId || '');

      console.log(`[Agent] 工具结果: ${result.substring(0, 200)}`);

      apiMessages.push({
        role: 'tool' as any,
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  // 超过轮次，返回兜底
  return '抱歉，我处理得有点慢，请再说一次。';
}
