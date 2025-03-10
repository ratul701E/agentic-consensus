import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiAgentService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>("GEMINI_API_KEY");

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is missing or empty.');
        }

        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey,
        });
    }

    async generateText(prompt: string): Promise<string> {
        try {
            console.log(`Generating text for prompt: ${prompt}`);
            const completion = await this.openai.chat.completions.create({
                model: "google/gemini-2.0-flash-lite-preview-02-05:free",
                messages: [{ role: "user", content: prompt }]
            });

            console.log("Response received.");
            return completion.choices[0]?.message?.content || 'No response from OpenAI.';
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error('Failed to generate response');
        }
    }

    get(): string {
        return "Hello Tanvir!";
    }
}
