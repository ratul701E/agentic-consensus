/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { whoIAm } from 'src/contexts/test';
import { TransactionDocument } from 'src/schema/transaction.schema';
import { LlamaResponse, Tx } from './dto';
import { TransactionService } from 'src/transaction/transaction.service';
import axios from 'axios';

@Injectable()
export class DeepseekAgentService {
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        private readonly transactionService: TransactionService
    ) {
        const apiKey = this.configService.get<string>("DEEPSEEK_API_KEY");

        if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY is missing or empty.');
        }

        this.openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey,
        });
    }

    async chatWithDeepSeek(transaction: Tx, systemMessage = whoIAm) {
        const transactions = await this.transactionService.getWhereKeyExist(transaction.sender);
        const balance = await this.transactionService.getUserBalanceByKey(transaction.sender);
        const userMessage = this.prepareUserMessage(transaction);
        const assistantMessage = this.prepareAssistantMessage(transactions, balance);

        const res = await axios.post('http://localhost:11434/api/chat', {
            "model": "llama3.2",
            "messages": [
                { "role": "system", "content": systemMessage },
                { "role": "assistant", "content": assistantMessage },
                { "role": "user", "content": userMessage }
            ],
            "stream": false,
            "format": {
                "type": "object",
                "properties": {
                    "decision": {
                        "type": "string",
                        "enum": ["yes", "no"]
                    },
                    "justification": {
                        "type": "string"
                    },
                    "txMetadata": {
                        "type": "object",
                        "properties": {
                            "sender_balance": {
                                "type": "number"
                            },
                            "requested_amount": {
                                "type": "number"
                            },
                            "status": {
                                "type": "string",
                                "enum": ["approved", "rejected"]  
                            }
                        },
                        "required": ["sender_balance", "requested_amount", "status"]
                    }
                },
                "required": ["decision", "justification", "txMetadata"]
            }
        }
        )
        const response = res.data as LlamaResponse;
        return JSON.parse(response.message.content);
        //return transactions;
        // try {
        //     console.log(`Requested..... \n[Rquested tx to valid. " + ${JSON.stringify(transaction)} ]`);

        //     console.log("User prompt: ", userMessage);

        //     //timer start 
        //     const startTime = Date.now();
        //     const completion = await this.openai.chat.completions.create({
        //         model: "deepseek/deepseek-r1:free",
        //         messages: [
        //             { role: 'system', content: systemMessage },
        //             { role: 'user', content: userMessage },
        //             { role: 'assistant', content: assistantMessage },
        //         ],
        //     });
        //     const endTime = Date.now();
        //     console.log("Requst completed in: ", endTime - startTime, "ms");
        //     // console.log(completion.choices[0]?.message);
        //     return this.cleanJsonString(completion.choices[0]?.message?.content) || 'No response from DeepSeek.';
        // } catch (error) {
        //     console.error('DeepSeek API Error:', error);
        //     throw new Error('Failed to generate response');
        // }
    }


    private prepareAssistantMessage(txHistory: TransactionDocument[], balance: number) {
        return `SENDER_BALANCE = ${balance}.`;
        return `here is the transaction history of the sender. Transaction history is given below.
                ${txHistory.map((tx, index) => `${index + 1}. "Sender": "${tx.sender}", "Receiver": "${tx.receiver}", "Amount": "${tx.amount}"`).join('\n')}

                Eventually SENDER_BALANCE = ${balance}.
        `;
    }

    private prepareUserMessage(tx: Tx) {
        return `transaction amount = ${tx.amount}`;
        return `
                 here is the transaction that this user want to send. now first based on the history of ther sender transaction, first calculate the incoming and outgoing amount. Then validate this transaction. Transaction is given below.
                ${JSON.stringify(tx)}
        `;
    }

    private cleanJsonString(input: string) {

        const jsonMatch = input.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("No valid JSON found in the input.");
        }

        try {
            return JSON.parse(jsonMatch[0].trim()); // Parse and return JSON
        } catch (error) {
            throw new Error("Invalid JSON format.");
        }
    }

}
