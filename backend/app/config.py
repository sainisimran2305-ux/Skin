import os
from dotenv import load_dotenv

# Load environment variables from the root .env file
# We search up one or two levels depending on run context
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=env_path)

class Settings:
    MONGODB_USERNAME: str = os.getenv("MONGODB_USERNAME", "")
    MONGODB_PASSWORD: str = os.getenv("MONGODB_PASSWORD", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DB_NAME: str = "prakriti_skincare"

settings = Settings()
