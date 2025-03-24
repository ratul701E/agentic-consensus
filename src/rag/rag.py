import sys
import json
import ollama
from pymongo import MongoClient
from datetime import datetime

mongo_client = MongoClient("mongodb://localhost:27017/agentic-consensus")
db = mongo_client.get_database()
transactions_collection = db.transactions

input_data = sys.stdin.read()
transaction = json.loads(input_data)

sender = transaction["sender"]
receiver = transaction["receiver"]
amount = float(transaction["amount"])

def serialize_mongo_docs(cursor):
    return [
        {
            "amount": txn["amount"],
            "created_at": txn.get("created_at", "").isoformat() if "created_at" in txn else None
        }
        for txn in cursor
    ]

prompt = f"""
Transaction Analysis:

Sender: {sender}
Receiver: {receiver}
Amount: {amount}

Transaction History:

Sent Transactions:
{json.dumps(serialize_mongo_docs(transactions_collection.find({"sender": sender})), indent=2)}

Received Transactions:
{json.dumps(serialize_mongo_docs(transactions_collection.find({"receiver": sender})), indent=2)}

Based on the information above, is this transaction valid? Provide a decision ('yes' or 'no') and a concise justification within 10 words, sent can not be greater than received.
"""


response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])

mistral_output = response["message"]["content"].strip()

output = {
    "justification": mistral_output
}

print(json.dumps(output))
