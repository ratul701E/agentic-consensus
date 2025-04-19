import { Injectable } from '@nestjs/common';
import { DeepseekAgentService } from 'src/modules/deepseek-agent/deepseek-agent.service';
import { TransactionService } from 'src/modules/transaction/transaction.service';

@Injectable()
export class ChainService {

    constructor(
        private readonly transactionService: TransactionService,
        private readonly deepseekService: DeepseekAgentService,
    ) { }


    // async registerTransaction(tx: Tx) {
    //     this.startConsensus(tx);
    // }


    // async startConsensus(tx: Tx) {
    //     const llms = Array.from({ length: 100 }, () => new LLM());

    //     // llms.forEach((llm, index) => llm.greet(index+1)); 

    //     console.log(`LLM count in chain: ${llms.length}`);
    //     console.log("Starting selection procedure...");

    //     //selection
    //     const selectedLLMs = llms
    //         .map((llm) => {
    //             const value = llm.getInfoOject();
    //             return {
    //                 llm,
    //                 selection_score: value.reputation * 0.25 + value.steak * 0.75,
    //             };
    //         })
    //         .sort((a, b) => b.selection_score - a.selection_score)
    //         .slice(0, 10)


    //     //roles
    //     const lead_miner = selectedLLMs[0].llm;
    //     const miners = selectedLLMs.slice(1, 4).map((llm) => llm.llm);
    //     const validators = selectedLLMs.slice(4, 10).map((llm) => llm.llm);

    //     console.log("Lead Miner: ", lead_miner);
    //     console.log("Oridinary Miners: ", miners);
    //     console.log("🧑‍🏭 Validators: ", validators);

    //     //validation
    //     const startTime = Date.now();
    //     await Promise.all(validators.map(async (llm) => {
    //         console.log(`🧑‍🏭 ${llm.getId()} is validating the transaction... 🕛\n`);
    //         const { userMessage, assistantMessage, systemMessage } = await this.deepseekService.getChatContent(tx);

    //         const response: LlamaResponse = await llm.gossip(systemMessage, assistantMessage, userMessage);
    //         const responseJson = JSON.parse(response.message.content)
    //         console.log(`🧑‍🏭 ${llm.getId()} has validated the transaction. Response: {decision: ${responseJson.decision} ${responseJson.decision === "yes" ? "✅" : "❌"}, justification: ${responseJson.justification}}\n`);
    //     }));
    //     const endTime = Date.now();
    //     console.log(`🕛 Time taken for validate transaction(s) by validators: ${endTime - startTime} ms`)
    // }

}
