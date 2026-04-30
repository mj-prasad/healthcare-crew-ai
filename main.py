
from dotenv import load_dotenv
load_dotenv()

import os

# MUST be before any crewai / litellm imports
os.environ["LITELLM_DISABLE_PRICE_MAP"] = "true"
os.environ["LITELLM_DISABLE_TELEMETRY"] = "true"
os.environ["LITELLM_LOG"] = "ERROR"

from api.app import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)