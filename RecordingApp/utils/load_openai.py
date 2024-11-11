from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()


class LoadOpenAI:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    async def get_response(self, system_role, user_message):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_role},
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content