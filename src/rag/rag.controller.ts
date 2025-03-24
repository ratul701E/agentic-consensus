import { Body, Controller, Post } from '@nestjs/common';
import { exec } from 'child_process';

@Controller('rag')
export class RagController {
  @Post('submit-transaction')
  async submitTransaction(
    @Body() body: { sender: string; receiver: string; amount: number },
  ) {
    return new Promise((resolve, reject) => {
      const input = JSON.stringify(body);

      const pythonProcess = exec('python3 src/rag/rag.py');

      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();

      let output = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (error) => {
        console.error('Python Error:', error.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return reject('Python script execution failed.');
        }
        try {
          const result = JSON.parse(output.trim());
          resolve(result);
        } catch (error) {
          reject('Error parsing Python output.');
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Execution Error:', err);
        reject('Failed to execute Python script.');
      });
    });
  }
}
