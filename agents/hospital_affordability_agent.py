from crewai import Agent

hospital_affordability_agent = Agent(
    role="Hospital Affordability Agent",
    goal="Rank hospitals by affordability",
    backstory="Healthcare cost analyst"
)