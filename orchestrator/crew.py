from crewai import Crew
from tasks.tasks import patient_task, hospital_task, doctor_task

def run_crew(payload: dict):
    crew = Crew(tasks=[patient_task, hospital_task, doctor_task], process="sequential")
    return {"result": crew.kickoff(inputs=payload)}