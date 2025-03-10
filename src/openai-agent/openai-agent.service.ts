import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenaiAgentService {
  private readonly openaiUrl = 'https://openrouter.ai/api/v1/chat/completions';
   private readonly apiKey = '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';

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.openaiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate text from OpenAI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      throw new Error('Failed to generate text from OpenAI');
    }
  }

  get():string {
    return "Hello Tanvir!";
  }
}
