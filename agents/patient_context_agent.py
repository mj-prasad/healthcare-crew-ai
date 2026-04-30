from crewai import Agent
from crewai.llm import LLM

llm = LLM(
    model="gpt-4o-mini",  # or any model you plan to use later
    api_key="dummy"       # overridden in prod via env
)


patient_context_agent = Agent(
    role="Patient Context Agent",
    goal="Extract structured patient intent",
    backstory="Healthcare intake specialist",
    llm=llm
)