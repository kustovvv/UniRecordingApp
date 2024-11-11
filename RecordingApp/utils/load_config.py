from dotenv import load_dotenv
from pyprojroot import here
from typing import List
import yaml
import os

load_dotenv()


class LoadConfig:
    # Class variable to track initialization
    _initialized = False

    def __init__(self) -> None:
        with open(here("configs/app_config.yml")) as cfg:
            self.app_config = yaml.load(cfg, Loader=yaml.FullLoader)

        # Data directories
        self.data_directory = self.app_config["directories"]["data_directory"]

        # Flask endpoint
        self.fastapi_endpoint = self.app_config["serve"]["fastapi_endpoint"]

        self.load_llm_configs()


        if not LoadConfig._initialized:
            # Clean up the upload doc vectordb if it exists
            # self.create_directory([self.data_directory])

            # Set initialization flag to True
            LoadConfig._initialized = True


    def load_llm_configs(self):
        self.initial_system_message = self.app_config["model"]["initial_system_message"]
        self.initial_user_message = self.app_config["model"]["initial_user_message"]
        self.system_message = self.app_config["model"]["system_message"]
        self.user_message = self.app_config["model"]["user_message"]
        self.final_system_message = self.app_config["model"]["final_system_message"]
        self.final_user_chat_template = self.app_config["model"]["final_user_chat_template"]

    @staticmethod
    def create_directory(dirs: List[str]):
        """
        Creates a directory if it does not exist.

        :param:
            dirs List[str]: The list of directories paths to be created
        """
        for directory in dirs:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"The directory '{directory}' has been created.")


