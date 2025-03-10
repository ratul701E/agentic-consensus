import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class DeepseekAgentService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>("DEEPSEEK_API_KEY");

        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY is missing or empty.');
        }

        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey,
        });
    }

    async chatWithDeepSeek(userMessage: string, systemMessage = 'You are a helpful assistant.') {
        try {
            console.log("Requested.....");
            const completion = await this.openai.chat.completions.create({
                model: "deepseek/deepseek-r1-zero:free",
                messages: [{ role: 'user', content: "hey how are you" }],
            });
            console.log("Requst completed.....");
            console.log(completion.choices[0]?.message);
            return completion.choices[0]?.message?.content || 'No response from DeepSeek.';
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            throw new Error('Failed to generate response');
        }
    }
}
