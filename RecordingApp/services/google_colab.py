from RecordingApp.utils.load_config import LoadConfig
from RecordingApp.utils.load_openai import LoadOpenAI
import os
import aiohttp
import asyncio
import re

CONFIG = LoadConfig()

class AudioToText:
    def __init__(self, audio_file_path):
        self.model_size = 'base'
        self.audio_file_path = audio_file_path
        self.fastapi_endpoint = f"{CONFIG.fastapi_endpoint}/process_audio"

    def create_form(self):
        form = aiohttp.FormData()
        form.add_field('model_size', self.model_size)

        audio_file = open(self.audio_file_path, 'rb')
        form.add_field(
            'audio_file',
            audio_file,
            filename=os.path.basename(self.audio_file_path),
            content_type='audio/wav'
        )
        return form

    async def transcribe_audio(self):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(self.fastapi_endpoint, data=self.create_form()) as response:
                    if response.status == 200:
                        response_data = await response.json()
                        return response_data
                    else:
                        error_message = await response.text()
                        print(f"Error: {response.status} {error_message}")
                        return None
        except Exception as e:
            print(f"Error sending audio file: {e}")
            return None


class ChatBot:
    def __init__(self, new_conversation=False):
        # Initialize chat history (empty string for now)
        self.chat_history = ''
        self.new_conversation = new_conversation
        self.openai = LoadOpenAI()

    def check_if_new_conversation(self):
        if self.new_conversation:
            self.chat_history = ''

    # Function to manage the conversation history
    def update_chat_history(self, user_message, bot_response):
        self.chat_history += f"User: {user_message}\nBot: {bot_response}\n"

    async def get_llm_response(self, system_message, user_message):
        response = await LoadOpenAI().get_response(system_message, user_message)
        return response

    def extract_user_messages(self):
        # Find all user messages (assuming each starts with "User:")
        user_messages = re.findall(r'User:\s+(.*?)(?=\n(User|Bot):|$)', self.chat_history, re.DOTALL)

        # Format each message with "user_message X: ..." structure
        formatted_messages = [f"user_message {i + 1}: {message.strip()}" for i, (message, _) in enumerate(user_messages)]

        # Join all messages into a single string
        return "\n".join(formatted_messages)

    async def chatbot_response(self, audio_file_path):
        # Reset chat history if it's a new conversation
        self.check_if_new_conversation()

        transcribed_text = await AudioToText(audio_file_path).transcribe_audio()

        user_message = CONFIG.user_message.format(self.chat_history, transcribed_text)

        # Get response and print it
        response = await self.get_llm_response(CONFIG.system_message, user_message)

        # Update chat history
        self.update_chat_history(transcribed_text, response)

        print(f"Chat history: {self.chat_history}\n")

    def process_last_user_message(self):
        user_chat_history = self.extract_user_messages()
        user_message = CONFIG.final_user_chat_template.format(user_chat_history)
        print("User chat history:", user_message)
        return user_message

    async def chat_loop(self):
        init_message = await self.get_llm_response(CONFIG.initial_system_message, CONFIG.initial_user_message)
        self.update_chat_history('', init_message)
        print(init_message)

        for i in range(2):
            print("Provide audio file path:\n")
            audio_file_path = input()
            await self.chatbot_response(audio_file_path)

        user_message = self.process_last_user_message()
        final_analysis = await self.get_llm_response(CONFIG.final_system_message, user_message)
        print(final_analysis)


chatbot = ChatBot()
test = r"D:\PyCharm Proffecional\Projects\UniRecordingApp\RecordingApp\recordings\wrong_text.wav"

# Run the async function
if __name__ == "__main__":
    asyncio.run(chatbot.chat_loop())