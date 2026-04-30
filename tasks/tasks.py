from crewai import Task
from agents.patient_context_agent import patient_context_agent
from agents.hospital_affordability_agent import hospital_affordability_agent
from agents.doctor_matching_agent import doctor_matching_agent

patient_task = Task(description="Extract patient context", agent=patient_context_agent, expected_output="Structured patient information including demographics, preferences, and medical context")
hospital_task = Task(description="Rank hospitals", agent=hospital_affordability_agent, expected_output="Ranked list of hospitals with affordability analysis and recommendations")
doctor_task = Task(description="Match doctors", agent=doctor_matching_agent, expected_output="List of matched doctors with specialties, ratings, and availability")