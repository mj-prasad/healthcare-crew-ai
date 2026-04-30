from crewai import Agent
from crewai.llm import LLM

llm = LLM(
    model="gpt-4o-mini",  # or any model you plan to use later
    api_key="dummy"       # overridden in prod via env
)

doctor_matching_agent = Agent(
    role="Doctor Matching Agent",
    goal="Match doctors by specialty and quality",
    backstory="Clinical operations expert",
    llm=llm
)