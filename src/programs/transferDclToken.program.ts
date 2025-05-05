export function transferDclToken(sender: string, receiver: string, amount: number, availableAmount: number, signature: string) {
  console.log('Sender:', sender);
  console.log('Receiver:', receiver);
  console.log('Amount:', amount);
  console.log('Available Amount:', availableAmount);
  if (amount > availableAmount) {
    return false;
  }

  const transaction = {
    from: sender,
    to: receiver,
    value: amount,
    timestamp: new Date(),
    transactionAction: "TRANSFER_DCL_TOKEN",
    status: "SUCCESS",
    block: 0,
    transactionHash: "",
    signature,
    transactionFee: 0,
    gasPrice: 0,
  };

  return transaction;
}
