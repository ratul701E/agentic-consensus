import { Body, Controller, Post } from '@nestjs/common';
import { exec } from 'child_process';

@Controller('llm')
export class LlmController {

  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return new Promise((resolve, reject) => {
      const input = JSON.stringify(body);

      const pythonProcess = exec('python3 src/llm/llm.py', (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing Python script:', stderr);
          return reject('Failed to execute Python script');
        }

        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (parseError) {
          reject('Error parsing Python output');
        }
      });

      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();
    });
  }
}
