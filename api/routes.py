from fastapi import APIRouter, Query
from typing import Optional
from orchestrator.crew import run_crew
from data.mock_data import (
    get_specialties,
    get_hospitals,
    get_hospital,
    get_doctors,
    get_doctor,
    get_slots,
    book_slot,
    get_bookings,
)

router = APIRouter()


# ── CrewAI orchestration endpoint ──────────────────────────────────────────
@router.post("/appointments")
def book_appointment(payload: dict):
    return run_crew(payload)


# ── Browse endpoints (data fetched from hospital sources) ──────────────────

@router.get("/api/specialties")
def list_specialties():
    return get_specialties()


@router.get("/api/hospitals")
def list_hospitals(
    specialty: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    sort_by: str = Query("affordability_score"),
):
    return get_hospitals(specialty=specialty, location=location, sort_by=sort_by)


@router.get("/api/hospitals/{hospital_id}")
def hospital_detail(hospital_id: str):
    return get_hospital(hospital_id)


@router.get("/api/doctors")
def list_doctors(
    hospital_id: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None),
    sort_by: str = Query("rating"),
):
    return get_doctors(hospital_id=hospital_id, specialty=specialty, sort_by=sort_by)


@router.get("/api/doctors/{doctor_id}")
def doctor_detail(doctor_id: str):
    return get_doctor(doctor_id)


@router.get("/api/doctors/{doctor_id}/slots")
def doctor_slots(doctor_id: str, date: Optional[str] = Query(None)):
    return get_slots(doctor_id, date=date)


@router.post("/api/book")
def book(payload: dict):
    return book_slot(
        slot_id=payload.get("slot_id"),
        patient_name=payload.get("patient_name"),
        patient_phone=payload.get("patient_phone"),
        doctor_id=payload.get("doctor_id", ""),
    )


@router.get("/api/bookings")
def list_bookings():
    return get_bookings()