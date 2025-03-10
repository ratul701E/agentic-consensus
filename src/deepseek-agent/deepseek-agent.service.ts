import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { whoIAm } from 'src/contexts/test';

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

    async chatWithDeepSeek(userMessage: string, systemMessage = whoIAm) {
        try {
            console.log(`Requested..... ["not this is a tx you have to valid. " + ${userMessage} ]`);
            const completion = await this.openai.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: "this is a tx you have to valid. " + userMessage }
                ],
            });
            console.log("Requst completed.....");
            // console.log(completion.choices[0]?.message);
            return completion.choices[0]?.message?.content || 'No response from DeepSeek.';
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            throw new Error('Failed to generate response');
        }
    }
}
