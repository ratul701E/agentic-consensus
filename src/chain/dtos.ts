export type ValidatorVote = {
    validator_id: string;
    vote: string;
    justification: string;
    scores_by_miners: MinerVoteOnValidatorVote[];
}

export type MinerVoteOnValidatorVote = {
    miner_id: string;
    score: number;
}