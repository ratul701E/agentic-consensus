export type Tx = {
    sender: string;
    receiver: string;
    amount: string;
}

export type LlamaResponse = {
    model: string;
    created_at: string;
    message: {
      role: string;
      content: any;
    };
    done_reason: string;
    done: boolean;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
  }