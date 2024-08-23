import os
from dotenv import load_dotenv #type: ignore
from groq import Groq #type: ignore

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Who are you?",
        }
    ],
    model="llama3-8b-8192",
    max_tokens=5,
)

print(chat_completion.choices[0].message.content)
