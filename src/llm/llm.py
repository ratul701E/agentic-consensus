import sys
import json

input_data = sys.stdin.read()
data = json.loads(input_data)

user_input = data.get("prompt", "").strip().lower()

responses = {
    "hello": "Hello! How can I help you?",
    "how are you": "I'm a bot, but I'm doing great!",
    "what is your name": "I'm your custom LLM service.",
    "bye": "Goodbye! Have a nice day.",
}

response = responses.get(user_input, "I don't understand that yet. I'm still learning!")

print(json.dumps({"response": response}))
