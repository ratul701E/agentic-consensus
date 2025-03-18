import axios from "axios";
import { randomInt, randomUUID } from "crypto";
import { LlamaResponse } from "src/deepseek-agent/dto";

export class LLM {

    private id: string;
    private steak: number;
    private reputation: number;

    constructor() {
        this.id = randomUUID();
        this.steak = randomInt(0, 100);
        this.reputation = randomInt(10, 30);
    }

    public async gossip(systemMessage: string, assistantMessage: string, userMessage: string): Promise<LlamaResponse> {
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
        return response;
    }

    public greet(number: number) {
        console.log(`Hello, from LLM ${number}`);
    }

    public getInfo() {
        return `Agent: ${this.id}, Steak: ${this.steak}, Reputation: ${this.reputation}`;
    }

    public getInfoOject(): { id: string, steak: number, reputation: number } {
        return {
            id: this.id,
            steak: this.steak,
            reputation: this.reputation
        }
    }

    public getId() {
        return this.id;
    }
}