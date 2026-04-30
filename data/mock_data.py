"""
Mock data simulating Hospital Information Systems (HIS) and Doctor Scheduling APIs.
In production, these would be replaced by real hospital API integrations
as described in the HLD (tools/hospital_api.py, tools/doctor_api.py, tools/scheduling_tool.py).
"""

import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path

BOOKINGS_FILE = Path(__file__).resolve().parent.parent / "bookings.json"


def _load_bookings():
    if BOOKINGS_FILE.exists():
        return json.loads(BOOKINGS_FILE.read_text(encoding="utf-8"))
    return []


def _save_bookings(bookings):
    BOOKINGS_FILE.write_text(json.dumps(bookings, indent=2, ensure_ascii=False), encoding="utf-8")

# ---------------------------------------------------------------------------
# Specialties
# ---------------------------------------------------------------------------
SPECIALTIES = [
    "Orthopedics",
    "Cardiology",
    "Dermatology",
    "General Medicine",
    "Pediatrics",
    "Neurology",
    "Gynecology",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
]

# ---------------------------------------------------------------------------
# Hospitals
# ---------------------------------------------------------------------------
HOSPITALS = [
    {
        "hospital_id": "h1",
        "name": "Govt General Hospital",
        "type": "Government",
        "location": "Bangalore - Whitefield",
        "distance_km": 1.2,
        "avg_consultation_cost": 200,
        "insurance_supported": True,
        "insurance_types": ["CGHS", "ESI", "Ayushman Bharat"],
        "rating": 3.8,
        "affordability_score": 0.92,
        "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600",
        "specialties": ["General Medicine", "Orthopedics", "Pediatrics", "ENT", "Ophthalmology"],
    },
    {
        "hospital_id": "h2",
        "name": "Apollo Clinic",
        "type": "Private",
        "location": "Bangalore - Koramangala",
        "distance_km": 5.0,
        "avg_consultation_cost": 800,
        "insurance_supported": True,
        "insurance_types": ["Star Health", "ICICI Lombard", "HDFC Ergo", "Cash"],
        "rating": 4.5,
        "affordability_score": 0.68,
        "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
        "specialties": ["Cardiology", "Orthopedics", "Neurology", "Dermatology", "General Medicine"],
    },
    {
        "hospital_id": "h3",
        "name": "Fortis Hospital",
        "type": "Private",
        "location": "Bangalore - Bannerghatta Road",
        "distance_km": 14.0,
        "avg_consultation_cost": 1000,
        "insurance_supported": True,
        "insurance_types": ["Star Health", "Max Bupa", "HDFC Ergo", "Cash"],
        "rating": 4.6,
        "affordability_score": 0.55,
        "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600",
        "specialties": ["Cardiology", "Neurology", "Orthopedics", "Gynecology", "Psychiatry"],
    },
    {
        "hospital_id": "h4",
        "name": "Manipal Hospital",
        "type": "Private",
        "location": "Bangalore - HAL Airport Road",
        "distance_km": 9.0,
        "avg_consultation_cost": 900,
        "insurance_supported": True,
        "insurance_types": ["Bajaj Allianz", "Star Health", "ICICI Lombard", "Cash"],
        "rating": 4.4,
        "affordability_score": 0.62,
        "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600",
        "specialties": ["Dermatology", "ENT", "Pediatrics", "General Medicine", "Ophthalmology"],
    },
    {
        "hospital_id": "h5",
        "name": "Narayana Health",
        "type": "Private",
        "location": "Bangalore - Bommasandra",
        "distance_km": 22.0,
        "avg_consultation_cost": 600,
        "insurance_supported": True,
        "insurance_types": ["Ayushman Bharat", "Star Health", "Cash"],
        "rating": 4.3,
        "affordability_score": 0.78,
        "image": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600",
        "specialties": ["Cardiology", "Orthopedics", "Neurology", "Gynecology", "Pediatrics"],
    },
    {
        "hospital_id": "h6",
        "name": "Community Health Centre",
        "type": "Government",
        "location": "Bangalore - Marathahalli",
        "distance_km": 0.8,
        "avg_consultation_cost": 100,
        "insurance_supported": True,
        "insurance_types": ["CGHS", "ESI", "Ayushman Bharat"],
        "rating": 3.5,
        "affordability_score": 0.95,
        "image": "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600",
        "specialties": ["General Medicine", "Pediatrics", "Gynecology"],
    },
    {
        "hospital_id": "h7",
        "name": "Sankara Eye Hospital",
        "type": "Private",
        "location": "Bangalore - Kundalahalli",
        "distance_km": 6.5,
        "avg_consultation_cost": 500,
        "insurance_supported": True,
        "insurance_types": ["Star Health", "ICICI Lombard", "Cash"],
        "rating": 4.7,
        "affordability_score": 0.74,
        "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
        "specialties": ["Ophthalmology", "General Medicine"],
    },
    {
        "hospital_id": "h8",
        "name": "NIMHANS",
        "type": "Government",
        "location": "Bangalore - Hosur Road",
        "distance_km": 18.0,
        "avg_consultation_cost": 150,
        "insurance_supported": True,
        "insurance_types": ["CGHS", "ESI", "Ayushman Bharat"],
        "rating": 4.6,
        "affordability_score": 0.93,
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600",
        "specialties": ["Psychiatry", "Neurology", "General Medicine"],
    },
    {
        "hospital_id": "h9",
        "name": "Columbia Asia Hospital",
        "type": "Private",
        "location": "Bangalore - Hebbal",
        "distance_km": 11.0,
        "avg_consultation_cost": 750,
        "insurance_supported": True,
        "insurance_types": ["Max Bupa", "Star Health", "Bajaj Allianz", "Cash"],
        "rating": 4.3,
        "affordability_score": 0.65,
        "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600",
        "specialties": ["ENT", "Dermatology", "Orthopedics", "Ophthalmology", "Psychiatry"],
    },
    {
        "hospital_id": "h10",
        "name": "Jayadeva Institute of Cardiology",
        "type": "Government",
        "location": "Bangalore - Jayanagar",
        "distance_km": 3.5,
        "avg_consultation_cost": 250,
        "insurance_supported": True,
        "insurance_types": ["CGHS", "ESI", "Ayushman Bharat"],
        "rating": 4.5,
        "affordability_score": 0.90,
        "image": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600",
        "specialties": ["Cardiology", "General Medicine"],
    },
]

# ---------------------------------------------------------------------------
# Doctors
# ---------------------------------------------------------------------------
DOCTORS = [
    # Govt General Hospital doctors
    {"doctor_id": "d1", "name": "Dr. Rajesh Sharma", "hospital_id": "h1", "specialty": "General Medicine", "experience_years": 20, "fee": 200, "rating": 4.2, "image": "https://randomuser.me/api/portraits/men/32.jpg"},
    {"doctor_id": "d2", "name": "Dr. Priya Nair", "hospital_id": "h1", "specialty": "Orthopedics", "experience_years": 12, "fee": 250, "rating": 4.0, "image": "https://randomuser.me/api/portraits/women/44.jpg"},
    {"doctor_id": "d3", "name": "Dr. Sunil Reddy", "hospital_id": "h1", "specialty": "Pediatrics", "experience_years": 15, "fee": 200, "rating": 4.3, "image": "https://randomuser.me/api/portraits/men/45.jpg"},

    # Apollo Clinic doctors
    {"doctor_id": "d4", "name": "Dr. A Kumar", "hospital_id": "h2", "specialty": "Orthopedics", "experience_years": 15, "fee": 800, "rating": 4.6, "image": "https://randomuser.me/api/portraits/men/52.jpg"},
    {"doctor_id": "d5", "name": "Dr. Meena Iyer", "hospital_id": "h2", "specialty": "Cardiology", "experience_years": 18, "fee": 1000, "rating": 4.7, "image": "https://randomuser.me/api/portraits/women/65.jpg"},
    {"doctor_id": "d6", "name": "Dr. Vikram Patel", "hospital_id": "h2", "specialty": "Dermatology", "experience_years": 10, "fee": 700, "rating": 4.4, "image": "https://randomuser.me/api/portraits/men/67.jpg"},
    {"doctor_id": "d7", "name": "Dr. Sneha Das", "hospital_id": "h2", "specialty": "Neurology", "experience_years": 14, "fee": 900, "rating": 4.5, "image": "https://randomuser.me/api/portraits/women/33.jpg"},

    # Fortis Hospital doctors
    {"doctor_id": "d8", "name": "Dr. Arjun Menon", "hospital_id": "h3", "specialty": "Cardiology", "experience_years": 22, "fee": 1200, "rating": 4.8, "image": "https://randomuser.me/api/portraits/men/71.jpg"},
    {"doctor_id": "d9", "name": "Dr. Kavitha Rao", "hospital_id": "h3", "specialty": "Neurology", "experience_years": 16, "fee": 1000, "rating": 4.5, "image": "https://randomuser.me/api/portraits/women/56.jpg"},
    {"doctor_id": "d10", "name": "Dr. Ramesh Gupta", "hospital_id": "h3", "specialty": "Orthopedics", "experience_years": 19, "fee": 1100, "rating": 4.6, "image": "https://randomuser.me/api/portraits/men/36.jpg"},
    {"doctor_id": "d11", "name": "Dr. Anita Joshi", "hospital_id": "h3", "specialty": "Gynecology", "experience_years": 13, "fee": 950, "rating": 4.4, "image": "https://randomuser.me/api/portraits/women/28.jpg"},

    # Manipal Hospital doctors
    {"doctor_id": "d12", "name": "Dr. Sanjay Kulkarni", "hospital_id": "h4", "specialty": "Dermatology", "experience_years": 11, "fee": 850, "rating": 4.3, "image": "https://randomuser.me/api/portraits/men/22.jpg"},
    {"doctor_id": "d13", "name": "Dr. Deepa Verma", "hospital_id": "h4", "specialty": "ENT", "experience_years": 9, "fee": 750, "rating": 4.1, "image": "https://randomuser.me/api/portraits/women/41.jpg"},
    {"doctor_id": "d14", "name": "Dr. Mohan Krishnan", "hospital_id": "h4", "specialty": "Pediatrics", "experience_years": 17, "fee": 800, "rating": 4.5, "image": "https://randomuser.me/api/portraits/men/55.jpg"},

    # Narayana Health doctors
    {"doctor_id": "d15", "name": "Dr. Lakshmi Bhat", "hospital_id": "h5", "specialty": "Cardiology", "experience_years": 20, "fee": 700, "rating": 4.6, "image": "https://randomuser.me/api/portraits/women/51.jpg"},
    {"doctor_id": "d16", "name": "Dr. Anil Thomas", "hospital_id": "h5", "specialty": "Orthopedics", "experience_years": 14, "fee": 600, "rating": 4.3, "image": "https://randomuser.me/api/portraits/men/48.jpg"},
    {"doctor_id": "d17", "name": "Dr. Swati Mishra", "hospital_id": "h5", "specialty": "Gynecology", "experience_years": 11, "fee": 550, "rating": 4.2, "image": "https://randomuser.me/api/portraits/women/62.jpg"},

    # Community Health Centre doctors
    {"doctor_id": "d18", "name": "Dr. Ravi Kumar", "hospital_id": "h6", "specialty": "General Medicine", "experience_years": 8, "fee": 100, "rating": 3.9, "image": "https://randomuser.me/api/portraits/men/29.jpg"},
    {"doctor_id": "d19", "name": "Dr. Pooja Singh", "hospital_id": "h6", "specialty": "Pediatrics", "experience_years": 6, "fee": 100, "rating": 3.8, "image": "https://randomuser.me/api/portraits/women/35.jpg"},
    {"doctor_id": "d20", "name": "Dr. Nandini Rao", "hospital_id": "h6", "specialty": "Gynecology", "experience_years": 10, "fee": 100, "rating": 4.0, "image": "https://randomuser.me/api/portraits/women/68.jpg"},

    # Sankara Eye Hospital doctors
    {"doctor_id": "d21", "name": "Dr. Harish Prasad", "hospital_id": "h7", "specialty": "Ophthalmology", "experience_years": 25, "fee": 600, "rating": 4.8, "image": "https://randomuser.me/api/portraits/men/60.jpg"},
    {"doctor_id": "d22", "name": "Dr. Revathi Suresh", "hospital_id": "h7", "specialty": "Ophthalmology", "experience_years": 14, "fee": 500, "rating": 4.6, "image": "https://randomuser.me/api/portraits/women/72.jpg"},
    {"doctor_id": "d23", "name": "Dr. Kiran Hegde", "hospital_id": "h7", "specialty": "General Medicine", "experience_years": 9, "fee": 400, "rating": 4.2, "image": "https://randomuser.me/api/portraits/men/74.jpg"},

    # NIMHANS doctors
    {"doctor_id": "d24", "name": "Dr. Shobha Srinivas", "hospital_id": "h8", "specialty": "Psychiatry", "experience_years": 28, "fee": 200, "rating": 4.9, "image": "https://randomuser.me/api/portraits/women/58.jpg"},
    {"doctor_id": "d25", "name": "Dr. Venkatesh Murthy", "hospital_id": "h8", "specialty": "Psychiatry", "experience_years": 18, "fee": 150, "rating": 4.6, "image": "https://randomuser.me/api/portraits/men/63.jpg"},
    {"doctor_id": "d26", "name": "Dr. Anuradha Pai", "hospital_id": "h8", "specialty": "Neurology", "experience_years": 22, "fee": 200, "rating": 4.7, "image": "https://randomuser.me/api/portraits/women/46.jpg"},
    {"doctor_id": "d27", "name": "Dr. Suresh Babu", "hospital_id": "h8", "specialty": "General Medicine", "experience_years": 12, "fee": 150, "rating": 4.1, "image": "https://randomuser.me/api/portraits/men/40.jpg"},

    # Columbia Asia Hospital doctors
    {"doctor_id": "d28", "name": "Dr. Nitin Yadav", "hospital_id": "h9", "specialty": "ENT", "experience_years": 13, "fee": 800, "rating": 4.4, "image": "https://randomuser.me/api/portraits/men/77.jpg"},
    {"doctor_id": "d29", "name": "Dr. Pallavi Deshpande", "hospital_id": "h9", "specialty": "Dermatology", "experience_years": 8, "fee": 700, "rating": 4.2, "image": "https://randomuser.me/api/portraits/women/25.jpg"},
    {"doctor_id": "d30", "name": "Dr. Rohan Mehta", "hospital_id": "h9", "specialty": "Orthopedics", "experience_years": 16, "fee": 850, "rating": 4.5, "image": "https://randomuser.me/api/portraits/men/83.jpg"},
    {"doctor_id": "d31", "name": "Dr. Sunita Kamath", "hospital_id": "h9", "specialty": "Ophthalmology", "experience_years": 11, "fee": 750, "rating": 4.3, "image": "https://randomuser.me/api/portraits/women/39.jpg"},
    {"doctor_id": "d32", "name": "Dr. Ashwin Gowda", "hospital_id": "h9", "specialty": "Psychiatry", "experience_years": 7, "fee": 700, "rating": 4.1, "image": "https://randomuser.me/api/portraits/men/86.jpg"},

    # Jayadeva Institute of Cardiology doctors
    {"doctor_id": "d33", "name": "Dr. Raghavendra Rao", "hospital_id": "h10", "specialty": "Cardiology", "experience_years": 30, "fee": 300, "rating": 4.9, "image": "https://randomuser.me/api/portraits/men/50.jpg"},
    {"doctor_id": "d34", "name": "Dr. Suma Hegde", "hospital_id": "h10", "specialty": "Cardiology", "experience_years": 19, "fee": 250, "rating": 4.6, "image": "https://randomuser.me/api/portraits/women/47.jpg"},
    {"doctor_id": "d35", "name": "Dr. Prashanth Kumar", "hospital_id": "h10", "specialty": "General Medicine", "experience_years": 14, "fee": 200, "rating": 4.3, "image": "https://randomuser.me/api/portraits/men/57.jpg"},

    # Additional doctors for existing hospitals (filling specialty gaps)
    # Govt General Hospital - ENT, Ophthalmology
    {"doctor_id": "d36", "name": "Dr. Vasudha Rani", "hospital_id": "h1", "specialty": "ENT", "experience_years": 11, "fee": 200, "rating": 4.1, "image": "https://randomuser.me/api/portraits/women/70.jpg"},
    {"doctor_id": "d37", "name": "Dr. Nagaraj Shetty", "hospital_id": "h1", "specialty": "Ophthalmology", "experience_years": 18, "fee": 250, "rating": 4.4, "image": "https://randomuser.me/api/portraits/men/38.jpg"},

    # Apollo Clinic - General Medicine
    {"doctor_id": "d38", "name": "Dr. Divya Rangan", "hospital_id": "h2", "specialty": "General Medicine", "experience_years": 12, "fee": 700, "rating": 4.3, "image": "https://randomuser.me/api/portraits/women/55.jpg"},

    # Fortis Hospital - Psychiatry
    {"doctor_id": "d39", "name": "Dr. Tarun Bhatia", "hospital_id": "h3", "specialty": "Psychiatry", "experience_years": 15, "fee": 1100, "rating": 4.5, "image": "https://randomuser.me/api/portraits/men/42.jpg"},

    # Manipal Hospital - Ophthalmology, General Medicine
    {"doctor_id": "d40", "name": "Dr. Arun Seshadri", "hospital_id": "h4", "specialty": "Ophthalmology", "experience_years": 13, "fee": 800, "rating": 4.4, "image": "https://randomuser.me/api/portraits/men/88.jpg"},
    {"doctor_id": "d41", "name": "Dr. Geeta Kulkarni", "hospital_id": "h4", "specialty": "General Medicine", "experience_years": 16, "fee": 750, "rating": 4.3, "image": "https://randomuser.me/api/portraits/women/82.jpg"},

    # Narayana Health - Pediatrics, Neurology
    {"doctor_id": "d42", "name": "Dr. Shilpa Nayak", "hospital_id": "h5", "specialty": "Pediatrics", "experience_years": 9, "fee": 500, "rating": 4.2, "image": "https://randomuser.me/api/portraits/women/30.jpg"},
    {"doctor_id": "d43", "name": "Dr. Mahesh Gowda", "hospital_id": "h5", "specialty": "Neurology", "experience_years": 17, "fee": 650, "rating": 4.5, "image": "https://randomuser.me/api/portraits/men/64.jpg"},
]


def _generate_slots(doctor_id: str):
    """Generate mock time slots for the next 7 days."""
    slots = []
    base = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0) + timedelta(days=1)
    slot_id_counter = 1
    for day_offset in range(7):
        day = base + timedelta(days=day_offset)
        if day.weekday() == 6:  # skip Sunday
            continue
        for hour in [9, 10, 11, 14, 15, 16]:
            for minute in [0, 30]:
                slot_time = day.replace(hour=hour, minute=minute)
                # Mark some slots as booked randomly based on hash
                booked = hash(f"{doctor_id}-{slot_time}") % 3 == 0
                slots.append({
                    "slot_id": f"{doctor_id}-s{slot_id_counter}",
                    "doctor_id": doctor_id,
                    "datetime": slot_time.strftime("%Y-%m-%d %H:%M"),
                    "date": slot_time.strftime("%Y-%m-%d"),
                    "time": slot_time.strftime("%H:%M"),
                    "available": not booked,
                })
                slot_id_counter += 1
    return slots


# ---------------------------------------------------------------------------
# Public query functions (simulate hospital API / tool calls)
# ---------------------------------------------------------------------------

def get_specialties():
    return SPECIALTIES


def get_hospitals(specialty: str = None, location: str = None, sort_by: str = "affordability_score"):
    results = HOSPITALS[:]
    if specialty:
        results = [h for h in results if specialty in h["specialties"]]
    if location:
        results = [h for h in results if location.lower() in h["location"].lower()]
    reverse = sort_by in ("affordability_score", "rating")
    results.sort(key=lambda h: h.get(sort_by, 0), reverse=reverse)
    return results


def get_hospital(hospital_id: str):
    for h in HOSPITALS:
        if h["hospital_id"] == hospital_id:
            return h
    return None


def get_doctors(hospital_id: str = None, specialty: str = None, sort_by: str = "rating"):
    results = DOCTORS[:]
    if hospital_id:
        results = [d for d in results if d["hospital_id"] == hospital_id]
    if specialty:
        results = [d for d in results if d["specialty"] == specialty]
    # Attach hospital name and distance
    hospital_map = {h["hospital_id"]: h for h in HOSPITALS}
    for d in results:
        hosp = hospital_map.get(d["hospital_id"], {})
        d["hospital_name"] = hosp.get("name", "")
        d["distance_km"] = hosp.get("distance_km", 0)
    reverse = sort_by in ("rating", "experience_years")
    results.sort(key=lambda d: d.get(sort_by, 0), reverse=reverse)
    return results


def get_doctor(doctor_id: str):
    for d in DOCTORS:
        if d["doctor_id"] == doctor_id:
            hospital = get_hospital(d["hospital_id"])
            return {
                **d,
                "hospital_name": hospital["name"] if hospital else "",
                "distance_km": hospital["distance_km"] if hospital else 0,
            }
    return None


def get_slots(doctor_id: str, date: str = None):
    slots = _generate_slots(doctor_id)
    if date:
        slots = [s for s in slots if s["date"] == date]
    return slots


def book_slot(slot_id: str, patient_name: str, patient_phone: str, doctor_id: str = ""):
    """Book a slot and persist to bookings.json."""
    booking = {
        "booking_id": str(uuid.uuid4()),
        "slot_id": slot_id,
        "doctor_id": doctor_id,
        "patient_name": patient_name,
        "patient_phone": patient_phone,
        "status": "CONFIRMED",
        "booked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    bookings = _load_bookings()
    bookings.append(booking)
    _save_bookings(bookings)
    return booking


def get_bookings():
    """Return all bookings from bookings.json."""
    return _load_bookings()
