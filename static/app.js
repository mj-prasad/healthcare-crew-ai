// ──────────────────────────────────────────────────────────────────────────────
// HealthConnect – Patient-Facing SPA
// ──────────────────────────────────────────────────────────────────────────────

const API = '';

// ── State ──────────────────────────────────────────────────────────────────
let specialtiesCache = [];
let currentUser = JSON.parse(localStorage.getItem('hc_user') || 'null');

// ── Navigation ─────────────────────────────────────────────────────────────
function navigate(view, params = {}) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(`view-${view}`);
  if (el) { el.classList.remove('hidden'); el.classList.add('fade-in'); }

  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('bg-primary-50', 'text-primary-700');
    b.classList.add('text-gray-600', 'hover:bg-gray-100');
  });
  const activeBtn = document.getElementById(`nav-${view}`) || document.getElementById(`nav-${view.split('-')[0]}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-primary-50', 'text-primary-700');
    activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-100');
  }

  switch (view) {
    case 'home': loadHome(); break;
    case 'hospitals': loadHospitals(); break;
    case 'hospital-detail': loadHospitalDetail(params.id); break;
    case 'doctors': loadDoctors(params); break;
    case 'doctor-detail': loadDoctorDetail(params.id); break;
    case 'login': break;
    case 'account': loadAccount(); break;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
async function api(path) {
  const res = await fetch(`${API}${path}`);
  return res.json();
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<svg class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  if (half) html += '<svg class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20" style="clip-path:inset(0 50% 0 0)"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  html += `<span class="text-sm text-gray-500 ml-1">${rating}</span>`;
  return html;
}

function badge(text, color = 'blue') {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return `<span class="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[color] || colors.blue}">${text}</span>`;
}

const specialtyIcons = {
  'Orthopedics': '🦴', 'Cardiology': '❤️', 'Dermatology': '🧴', 'General Medicine': '🩺',
  'Pediatrics': '👶', 'Neurology': '🧠', 'Gynecology': '🤰', 'ENT': '👂',
  'Ophthalmology': '👁️', 'Psychiatry': '🧘',
};

// ── Populate specialty dropdowns ────────────────────────────────────────────
async function loadSpecialties() {
  if (specialtiesCache.length) return specialtiesCache;
  specialtiesCache = await api('/api/specialties');
  ['filter-specialty-hosp', 'filter-specialty-doc'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    specialtiesCache.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      sel.appendChild(opt);
    });
  });
  return specialtiesCache;
}

// ── HOME ────────────────────────────────────────────────────────────────────
async function loadHome() {
  const [specialties, hospitals, doctors] = await Promise.all([
    loadSpecialties(),
    api('/api/hospitals'),
    api('/api/doctors'),
  ]);

  document.getElementById('stat-hospitals').textContent = hospitals.length;
  document.getElementById('stat-doctors').textContent = doctors.length;
  document.getElementById('stat-specialties').textContent = specialties.length;

  const grid = document.getElementById('specialty-grid');
  grid.innerHTML = specialties.map(s => `
    <button onclick="navigate('doctors', {specialty:'${s}'})"
      class="bg-white border border-gray-100 rounded-xl p-4 text-center card-hover cursor-pointer">
      <span class="text-3xl">${specialtyIcons[s] || '🏥'}</span>
      <p class="mt-2 text-sm font-medium text-gray-700">${s}</p>
    </button>
  `).join('');
}

// ── HOSPITALS ───────────────────────────────────────────────────────────────
async function loadHospitals() {
  await loadSpecialties();
  const specialty = document.getElementById('filter-specialty-hosp')?.value || '';
  const sortBy = document.getElementById('filter-sort-hosp')?.value || 'affordability_score';
  let url = `/api/hospitals?sort_by=${sortBy}`;
  if (specialty) url += `&specialty=${encodeURIComponent(specialty)}`;
  const hospitals = await api(url);

  const container = document.getElementById('hospital-list');
  container.innerHTML = hospitals.map(h => `
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover cursor-pointer" onclick="navigate('hospital-detail',{id:'${h.hospital_id}'})">
      <div class="h-40 bg-gray-200 overflow-hidden">
        <img src="${h.image}" alt="${h.name}" class="w-full h-full object-cover" onerror="this.style.display='none'" />
      </div>
      <div class="p-5">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-lg">${h.name}</h3>
          ${badge(h.type, h.type === 'Government' ? 'green' : 'blue')}
        </div>
        <p class="text-sm text-gray-500 mb-3">📍 ${h.location} &middot; ${h.distance_km} km</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-400">Avg. Consultation</p>
            <p class="text-lg font-bold text-accent-600">₹${h.avg_consultation_cost}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400">Affordability</p>
            <div class="w-20 h-2 bg-gray-200 rounded-full mt-1">
              <div class="h-2 rounded-full ${h.affordability_score > 0.7 ? 'bg-green-500' : h.affordability_score > 0.5 ? 'bg-yellow-500' : 'bg-red-400'}" style="width:${h.affordability_score * 100}%"></div>
            </div>
          </div>
        </div>
        <div class="mt-3">${stars(h.rating)}</div>
      </div>
    </div>
  `).join('');
}

// ── HOSPITAL DETAIL ─────────────────────────────────────────────────────────
async function loadHospitalDetail(id) {
  const [hospital, doctors] = await Promise.all([
    api(`/api/hospitals/${id}`),
    api(`/api/doctors?hospital_id=${id}`),
  ]);
  if (!hospital) return;

  const container = document.getElementById('hospital-detail-content');
  container.innerHTML = `
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
      <div class="h-56 bg-gray-200 overflow-hidden">
        <img src="${hospital.image}" alt="${hospital.name}" class="w-full h-full object-cover" onerror="this.style.display='none'" />
      </div>
      <div class="p-6">
        <div class="flex flex-wrap items-center gap-3 mb-3">
          <h2 class="text-2xl font-bold">${hospital.name}</h2>
          ${badge(hospital.type, hospital.type === 'Government' ? 'green' : 'blue')}
        </div>
        <p class="text-gray-500 mb-4">📍 ${hospital.location} &middot; ${hospital.distance_km} km away</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-400">Avg. Cost</p>
            <p class="text-xl font-bold text-accent-600">₹${hospital.avg_consultation_cost}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-400">Rating</p>
            <p class="text-xl font-bold text-yellow-500">${hospital.rating}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-400">Distance</p>
            <p class="text-xl font-bold text-primary-600">${hospital.distance_km} km</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-xs text-gray-400">Insurance</p>
            <p class="text-xl font-bold text-green-600">${hospital.insurance_supported ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-600 mb-2">Specialties Available</p>
          <div class="flex flex-wrap gap-2">${hospital.specialties.map(s => badge(s, 'purple')).join('')}</div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-600 mb-2">Insurance Accepted</p>
          <div class="flex flex-wrap gap-2">${hospital.insurance_types.map(t => badge(t, 'gray')).join('')}</div>
        </div>
      </div>
    </div>

    <h3 class="text-xl font-semibold mb-4">Doctors at ${hospital.name}</h3>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${doctors.map(d => doctorCard(d)).join('')}
    </div>
  `;
}

// ── DOCTORS ─────────────────────────────────────────────────────────────────
function doctorCard(d) {
  return `
    <div class="bg-white rounded-xl border border-gray-100 p-5 card-hover cursor-pointer" onclick="navigate('doctor-detail',{id:'${d.doctor_id}'})">
      <div class="flex items-center gap-4 mb-4">
        <img src="${d.image}" alt="${d.name}" class="w-14 h-14 rounded-full object-cover border-2 border-primary-100" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=dbeafe&color=1d4ed8'" />
        <div>
          <h4 class="font-semibold">${d.name}</h4>
          <p class="text-sm text-gray-500">${d.specialty}</p>
        </div>
      </div>
      <p class="text-xs text-gray-400 mb-1">${d.hospital_name || ''} ${d.distance_km != null ? '&middot; ' + d.distance_km + ' km' : ''}</p>
      <div class="flex items-center justify-between mt-3">
        <div>
          <p class="text-xs text-gray-400">Experience</p>
          <p class="font-semibold">${d.experience_years} yrs</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Fee</p>
          <p class="font-semibold text-accent-600">₹${d.fee}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">Distance</p>
          <p class="font-semibold text-primary-600">${d.distance_km != null ? d.distance_km + ' km' : '-'}</p>
        </div>
        <div class="text-right">${stars(d.rating)}</div>
      </div>
    </div>`;
}

async function loadDoctors(params = {}) {
  await loadSpecialties();
  const specEl = document.getElementById('filter-specialty-doc');
  if (params.specialty && specEl) specEl.value = params.specialty;

  const specialty = specEl?.value || '';
  const sortBy = document.getElementById('filter-sort-doc')?.value || 'rating';
  let url = `/api/doctors?sort_by=${sortBy}`;
  if (specialty) url += `&specialty=${encodeURIComponent(specialty)}`;
  const doctors = await api(url);

  document.getElementById('doctor-list').innerHTML = doctors.map(d => doctorCard(d)).join('');
}

// ── DOCTOR DETAIL + SLOT BOOKING ────────────────────────────────────────────
async function loadDoctorDetail(id) {
  const doctor = await api(`/api/doctors/${id}`);
  if (!doctor) return;

  const container = document.getElementById('doctor-detail-content');
  container.innerHTML = `
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div class="flex flex-col sm:flex-row items-start gap-6">
        <img src="${doctor.image}" alt="${doctor.name}" class="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
          onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=96&background=dbeafe&color=1d4ed8'" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold">${doctor.name}</h2>
          <p class="text-gray-500 mb-3">${doctor.specialty} &middot; ${doctor.hospital_name} &middot; ${doctor.distance_km} km away</p>
          <div class="flex flex-wrap gap-4">
            <div class="bg-gray-50 rounded-lg px-4 py-2">
              <p class="text-xs text-gray-400">Experience</p>
              <p class="font-bold">${doctor.experience_years} years</p>
            </div>
            <div class="bg-gray-50 rounded-lg px-4 py-2">
              <p class="text-xs text-gray-400">Consultation Fee</p>
              <p class="font-bold text-accent-600">₹${doctor.fee}</p>
            </div>
            <div class="bg-gray-50 rounded-lg px-4 py-2">
              <p class="text-xs text-gray-400">Rating</p>
              <div>${stars(doctor.rating)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slot picker -->
    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Available Appointment Slots</h3>
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2" id="date-tabs"></div>
      <div id="slot-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"></div>
    </div>

    <!-- Booking form -->
    <div id="booking-form-wrapper" class="hidden bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-lg font-semibold mb-4">Complete Your Booking</h3>
      <p class="text-sm text-gray-500 mb-4">Selected slot: <span id="selected-slot-label" class="font-semibold text-primary-600"></span></p>
      <form id="booking-form" onsubmit="submitBooking(event)" class="space-y-4 max-w-md">
        <input type="hidden" id="book-slot-id" />
        <input type="hidden" id="book-doctor-id" value="${doctor.doctor_id}" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input id="book-name" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Enter your name" value="${currentUser ? currentUser.name : ''}" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input id="book-phone" required pattern="[0-9]{10}" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="10-digit phone number" value="${currentUser ? currentUser.phone : ''}" />
        </div>
        <button type="submit" class="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition">Confirm Booking</button>
      </form>
    </div>
  `;

  // Load slots
  const slots = await api(`/api/doctors/${id}/slots`);
  const dates = [...new Set(slots.map(s => s.date))];
  const dateTabs = document.getElementById('date-tabs');
  dateTabs.innerHTML = dates.map((d, i) => {
    const dt = new Date(d + 'T00:00:00');
    const label = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    return `<button onclick="showSlots('${id}','${d}')" class="date-tab whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium border transition
      ${i === 0 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}">${label}</button>`;
  }).join('');

  if (dates.length) showSlots(id, dates[0]);
}

async function showSlots(doctorId, date) {
  // Update active tab
  document.querySelectorAll('.date-tab').forEach(btn => {
    btn.classList.remove('bg-primary-600', 'text-white', 'border-primary-600');
    btn.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
  });
  event?.target?.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
  event?.target?.classList.add('bg-primary-600', 'text-white', 'border-primary-600');

  const slots = await api(`/api/doctors/${doctorId}/slots?date=${date}`);
  const grid = document.getElementById('slot-grid');
  grid.innerHTML = slots.map(s => `
    <button ${s.available ? `onclick="selectSlot('${s.slot_id}','${s.datetime}')"` : 'disabled'}
      class="slot-btn px-3 py-2 rounded-lg text-sm font-medium border transition
      ${s.available ? 'bg-white border-gray-200 text-gray-700 hover:border-primary-500 hover:bg-primary-50 cursor-pointer' : 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed line-through'}">${s.time}</button>
  `).join('');
}

function selectSlot(slotId, datetime) {
  document.querySelectorAll('.slot-btn').forEach(b => {
    b.classList.remove('bg-primary-600', 'text-white', 'border-primary-600');
  });
  event.target.classList.add('bg-primary-600', 'text-white', 'border-primary-600');

  document.getElementById('book-slot-id').value = slotId;
  document.getElementById('selected-slot-label').textContent = datetime;
  document.getElementById('booking-form-wrapper').classList.remove('hidden');
  document.getElementById('booking-form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function submitBooking(e) {
  e.preventDefault();
  const payload = {
    slot_id: document.getElementById('book-slot-id').value,
    patient_name: document.getElementById('book-name').value,
    patient_phone: document.getElementById('book-phone').value,
    doctor_id: document.getElementById('book-doctor-id')?.value || '',
  };
  const result = await fetch(`${API}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

  // Show confirmation
  navigate('booking-confirm');
  document.getElementById('booking-confirm-content').innerHTML = `
    <div class="bg-white rounded-xl border border-gray-100 p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
      <p class="text-gray-500 mb-6">Your appointment has been successfully booked.</p>
      <div class="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
        <p><span class="text-gray-400 text-sm">Booking ID:</span> <span class="font-mono text-sm">${result.booking_id}</span></p>
        <p><span class="text-gray-400 text-sm">Patient:</span> <span class="font-medium">${result.patient_name}</span></p>
        <p><span class="text-gray-400 text-sm">Phone:</span> <span class="font-medium">${result.patient_phone}</span></p>
        <p><span class="text-gray-400 text-sm">Status:</span> ${badge(result.status, 'green')}</p>
      </div>
      <button onclick="navigate('home')" class="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 transition">Back to Home</button>
    </div>
  `;
}

// ── LOGIN / ACCOUNT ─────────────────────────────────────────────────────────

function updateAuthUI() {
  const loginBtn = document.getElementById('nav-login');
  const accountBtn = document.getElementById('nav-account');
  if (currentUser) {
    loginBtn.classList.add('hidden');
    accountBtn.classList.remove('hidden');
    accountBtn.classList.add('flex');
    document.getElementById('nav-account-name').textContent = currentUser.name.split(' ')[0];
  } else {
    loginBtn.classList.remove('hidden');
    accountBtn.classList.add('hidden');
    accountBtn.classList.remove('flex');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const name = document.getElementById('login-name').value.trim();
  const phone = document.getElementById('login-phone').value.trim();
  if (!name || !phone) return;
  currentUser = { name, phone };
  localStorage.setItem('hc_user', JSON.stringify(currentUser));
  updateAuthUI();
  navigate('account');
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('hc_user');
  updateAuthUI();
  navigate('home');
}

async function loadAccount() {
  if (!currentUser) { navigate('login'); return; }

  // Profile header
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('account-avatar').textContent = initials;
  document.getElementById('account-name').textContent = currentUser.name;
  document.getElementById('account-phone').textContent = '+91 ' + currentUser.phone;

  // Fetch bookings
  const allBookings = await api('/api/bookings');
  const myBookings = allBookings.filter(b =>
    b.patient_phone === currentUser.phone || b.patient_name.toLowerCase() === currentUser.name.toLowerCase()
  );

  const container = document.getElementById('account-bookings');
  if (!myBookings.length) {
    container.innerHTML = `
      <div class="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-gray-500 mb-4">No bookings yet</p>
        <button onclick="navigate('doctors')" class="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition">Book an Appointment</button>
      </div>`;
    return;
  }

  // Enrich bookings with doctor info
  const enriched = await Promise.all(myBookings.map(async (b) => {
    const doctorId = b.doctor_id || b.slot_id?.split('-s')[0] || '';
    let doctor = null;
    if (doctorId) {
      try { doctor = await api(`/api/doctors/${doctorId}`); } catch(e) {}
    }
    return { ...b, doctor };
  }));

  container.innerHTML = `
    <div class="space-y-4">
      ${enriched.reverse().map(b => {
        const doc = b.doctor;
        const slotTime = b.slot_id || 'N/A';
        return `
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                ${doc ? `<img src="${doc.image}" class="w-12 h-12 rounded-full object-cover border-2 border-primary-100" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=dbeafe&color=1d4ed8'" />` : '<div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">🩺</div>'}
                <div>
                  <h4 class="font-semibold">${doc ? doc.name : 'Doctor'}</h4>
                  <p class="text-sm text-gray-500">${doc ? doc.specialty + ' &middot; ' + doc.hospital_name : ''}</p>
                </div>
              </div>
              <span class="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">${b.status}</span>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-4 text-sm">
              <div><span class="text-gray-400">Booking ID:</span> <span class="font-mono text-xs">${b.booking_id.slice(0, 8)}...</span></div>
              <div><span class="text-gray-400">Booked:</span> <span class="font-medium">${b.booked_at || 'N/A'}</span></div>
              ${doc ? `<div><span class="text-gray-400">Fee:</span> <span class="font-medium text-accent-600">₹${doc.fee}</span></div>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ── AI ASSISTANT ────────────────────────────────────────────────────────────

const AGENT_DEFS = [
  { id: 'patient-context', name: 'Patient Context Agent', icon: '🗣️', color: 'blue', role: 'Parsing your query to extract symptoms, specialty, budget, location & urgency...' },
  { id: 'hospital-ranking', name: 'Hospital Affordability Agent', icon: '🏥', color: 'green', role: 'Searching & ranking hospitals by cost, distance, insurance and ratings...' },
  { id: 'doctor-matching', name: 'Doctor Matching Agent', icon: '👨‍⚕️', color: 'purple', role: 'Finding the best doctors by specialty fit, experience, rating & fee...' },
  { id: 'slot-optimization', name: 'Slot Optimization Agent', icon: '📅', color: 'orange', role: 'Checking real-time slot availability and predicting congestion...' },
  { id: 'recommendation', name: 'Recommendation Agent', icon: '✅', color: 'red', role: 'Comparing options, explaining trade-offs and preparing final recommendation...' },
];

const SPECIALTY_KEYWORDS = {
  'knee': 'Orthopedics', 'bone': 'Orthopedics', 'joint': 'Orthopedics', 'fracture': 'Orthopedics', 'orthop': 'Orthopedics', 'back pain': 'Orthopedics', 'spine': 'Orthopedics',
  'heart': 'Cardiology', 'chest pain': 'Cardiology', 'cardiac': 'Cardiology', 'cardio': 'Cardiology', 'bp': 'Cardiology', 'blood pressure': 'Cardiology',
  'skin': 'Dermatology', 'rash': 'Dermatology', 'acne': 'Dermatology', 'derma': 'Dermatology', 'eczema': 'Dermatology',
  'fever': 'General Medicine', 'cold': 'General Medicine', 'cough': 'General Medicine', 'general': 'General Medicine', 'weakness': 'General Medicine', 'diabetes': 'General Medicine',
  'child': 'Pediatrics', 'baby': 'Pediatrics', 'infant': 'Pediatrics', 'pediatric': 'Pediatrics', 'kid': 'Pediatrics',
  'headache': 'Neurology', 'migraine': 'Neurology', 'brain': 'Neurology', 'neuro': 'Neurology', 'seizure': 'Neurology', 'nerve': 'Neurology',
  'pregnancy': 'Gynecology', 'gynec': 'Gynecology', 'period': 'Gynecology', 'menstrual': 'Gynecology', 'women': 'Gynecology',
  'ear': 'ENT', 'nose': 'ENT', 'throat': 'ENT', 'sinus': 'ENT', 'ent': 'ENT', 'hearing': 'ENT', 'tonsil': 'ENT',
  'eye': 'Ophthalmology', 'vision': 'Ophthalmology', 'ophthal': 'Ophthalmology', 'cataract': 'Ophthalmology', 'glasses': 'Ophthalmology',
  'anxiety': 'Psychiatry', 'depression': 'Psychiatry', 'mental': 'Psychiatry', 'stress': 'Psychiatry', 'psychiatr': 'Psychiatry', 'sleep': 'Psychiatry', 'insomnia': 'Psychiatry',
};

function fillExample(text) {
  document.getElementById('ai-query').value = text;
}

function parseQuery(query) {
  const lower = query.toLowerCase();
  let specialty = 'General Medicine';
  for (const [kw, spec] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (lower.includes(kw)) { specialty = spec; break; }
  }
  const budgetMatch = lower.match(/(\d{2,5})\s*[-–to]+\s*(\d{2,5})/);
  const budgetSingle = lower.match(/(?:under|below|within|budget)\s*(?:of\s*)?(?:rs\.?|₹|rupees?)?\s*(\d{2,5})/i);
  let budgetMax = null;
  let budgetMin = null;
  if (budgetMatch) { budgetMin = parseInt(budgetMatch[1]); budgetMax = parseInt(budgetMatch[2]); }
  else if (budgetSingle) { budgetMax = parseInt(budgetSingle[1]); }

  const locationMatch = lower.match(/(?:near|in|at|around)\s+([\w\s]+?)(?:\s+(?:within|budget|under|with|urgently|,|\.|$))/i);
  const location = locationMatch ? locationMatch[1].trim() : null;

  const urgent = /urgent|emergency|immediately|asap|severe/i.test(lower);

  const insuranceMatch = lower.match(/(?:insurance|insured|policy)[:\s]*([\w\s]+?)(?:\.|,|$)/i);
  const insurance = insuranceMatch ? insuranceMatch[1].trim() : null;

  return { specialty, budgetMin, budgetMax, location, urgent, insurance, raw: query };
}

function agentStepHTML(agent, status, content = '') {
  const bgColors = { blue:'bg-blue-100', green:'bg-green-100', purple:'bg-purple-100', orange:'bg-orange-100', red:'bg-red-100' };
  const borderColors = { blue:'border-blue-200', green:'border-green-200', purple:'border-purple-200', orange:'border-orange-200', red:'border-red-200' };
  const statusClass = status === 'active' ? 'agent-active' : status === 'done' ? 'agent-done' : '';
  const iconExtra = status === 'active' ? '<div class="agent-pulse absolute inset-0 rounded-full bg-blue-400"></div>' : '';
  const checkmark = status === 'done' ? '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : '';
  const spinner = status === 'active' ? '<div class="flex gap-1 items-center"><span class="typing-dot w-2 h-2 bg-primary-500 rounded-full inline-block"></span><span class="typing-dot w-2 h-2 bg-primary-500 rounded-full inline-block"></span><span class="typing-dot w-2 h-2 bg-primary-500 rounded-full inline-block"></span></div>' : '';

  return `
    <div class="agent-step visible ${statusClass} bg-white rounded-xl border ${borderColors[agent.color]} p-4 mb-1" id="step-${agent.id}">
      <div class="flex items-start gap-4">
        <div class="relative flex-shrink-0">
          ${iconExtra}
          <div class="agent-icon w-12 h-12 rounded-full ${bgColors[agent.color]} flex items-center justify-center text-xl relative z-10 transition-shadow">${agent.icon}</div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-semibold text-sm">${agent.name}</h4>
            ${checkmark}
          </div>
          <p class="text-xs text-gray-400 mb-2">${agent.role}</p>
          ${status === 'active' && !content ? spinner : ''}
          ${content ? `<div class="bg-gray-50 rounded-lg p-3 text-sm mt-2">${content}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="agent-connector ${status === 'done' ? 'visible' : ''}" style="margin: 0 auto;"></div>`;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runAIAssistant(e) {
  e.preventDefault();
  const query = document.getElementById('ai-query').value.trim();
  if (!query) return;

  const btn = document.getElementById('ai-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-opacity=".3"/><path d="M12 2a10 10 0 019.95 9"/></svg> Running...';

  const stepsEl = document.getElementById('ai-agent-steps');
  const recEl = document.getElementById('ai-recommendation');
  stepsEl.innerHTML = '';
  recEl.classList.add('hidden');
  recEl.innerHTML = '';

  // ── Agent 1: Patient Context ──
  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'active');
  await delay(1500);
  const parsed = parseQuery(query);
  const contextHTML = `
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div><span class="text-gray-400">Specialty:</span> <span class="font-medium">${parsed.specialty}</span></div>
      <div><span class="text-gray-400">Urgency:</span> <span class="font-medium ${parsed.urgent ? 'text-red-600' : ''}">${parsed.urgent ? 'Urgent' : 'Routine'}</span></div>
      <div><span class="text-gray-400">Budget:</span> <span class="font-medium">${parsed.budgetMax ? '₹' + (parsed.budgetMin || 0) + ' – ₹' + parsed.budgetMax : 'Not specified'}</span></div>
      <div><span class="text-gray-400">Location:</span> <span class="font-medium">${parsed.location || 'Any'}</span></div>
      ${parsed.insurance ? `<div><span class="text-gray-400">Insurance:</span> <span class="font-medium">${parsed.insurance}</span></div>` : ''}
    </div>`;
  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'done', contextHTML);

  // ── Agent 2: Hospital Ranking ──
  stepsEl.innerHTML += agentStepHTML(AGENT_DEFS[1], 'active');
  await delay(1800);
  let hospUrl = `/api/hospitals?sort_by=affordability_score&specialty=${encodeURIComponent(parsed.specialty)}`;
  if (parsed.location) hospUrl += `&location=${encodeURIComponent(parsed.location)}`;
  let hospitals = await api(hospUrl);
  if (parsed.budgetMax) hospitals = hospitals.filter(h => h.avg_consultation_cost <= parsed.budgetMax);
  const topHospitals = hospitals.slice(0, 3);
  const hospHTML = topHospitals.length ? `
    <p class="text-xs text-gray-500 mb-2">Top ${topHospitals.length} hospitals ranked by affordability:</p>
    <div class="space-y-2">${topHospitals.map((h, i) => `
      <div class="flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-green-50 border border-green-100' : ''}">
        <span class="text-lg font-bold text-gray-300 w-6">${i + 1}</span>
        <div class="flex-1">
          <span class="font-medium text-sm">${h.name}</span>
          <span class="text-xs text-gray-400 ml-2">${h.distance_km} km &middot; ₹${h.avg_consultation_cost}</span>
        </div>
        <span class="text-xs font-medium px-2 py-0.5 rounded-full ${h.type === 'Government' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}">${h.type}</span>
      </div>`).join('')}
    </div>` : '<p class="text-xs text-red-500">No hospitals found matching your criteria. Showing all options.</p>';

  // Replace agent 2 active with done
  const allSteps = stepsEl.innerHTML;
  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'done', contextHTML) + agentStepHTML(AGENT_DEFS[1], 'done', hospHTML);

  // ── Agent 3: Doctor Matching ──
  stepsEl.innerHTML += agentStepHTML(AGENT_DEFS[2], 'active');
  await delay(2000);
  let doctors = await api(`/api/doctors?specialty=${encodeURIComponent(parsed.specialty)}&sort_by=rating`);
  if (topHospitals.length) {
    const hospIds = new Set(topHospitals.map(h => h.hospital_id));
    const filtered = doctors.filter(d => hospIds.has(d.hospital_id));
    if (filtered.length) doctors = filtered;
  }
  if (parsed.budgetMax) {
    const budgetFiltered = doctors.filter(d => d.fee <= parsed.budgetMax);
    if (budgetFiltered.length) doctors = budgetFiltered;
  }
  const topDoctors = doctors.slice(0, 3);
  const docHTML = topDoctors.length ? `
    <p class="text-xs text-gray-500 mb-2">Top ${topDoctors.length} doctors matched:</p>
    <div class="space-y-2">${topDoctors.map((d, i) => `
      <div class="flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-purple-50 border border-purple-100' : ''}">
        <img src="${d.image}" class="w-9 h-9 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&size=36&background=dbeafe&color=1d4ed8'" />
        <div class="flex-1">
          <span class="font-medium text-sm">${d.name}</span>
          <span class="text-xs text-gray-400 ml-1">${d.experience_years} yrs exp</span>
          <p class="text-xs text-gray-400">${d.hospital_name} &middot; ₹${d.fee}</p>
        </div>
        <div class="text-right"><span class="text-xs font-semibold text-yellow-600">${d.rating} ★</span></div>
      </div>`).join('')}
    </div>` : '<p class="text-xs text-red-500">No doctors found for this specialty.</p>';

  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'done', contextHTML) + agentStepHTML(AGENT_DEFS[1], 'done', hospHTML) + agentStepHTML(AGENT_DEFS[2], 'done', docHTML);

  // ── Agent 4: Slot Optimization ──
  stepsEl.innerHTML += agentStepHTML(AGENT_DEFS[3], 'active');
  await delay(1500);
  let slotHTML = '';
  if (topDoctors.length) {
    const bestDoc = topDoctors[0];
    const slots = await api(`/api/doctors/${bestDoc.doctor_id}/slots`);
    const available = slots.filter(s => s.available).slice(0, 4);
    slotHTML = `
      <p class="text-xs text-gray-500 mb-2">Best slots for ${bestDoc.name}:</p>
      <div class="flex flex-wrap gap-2">${available.map((s, i) => `
        <span class="text-xs px-3 py-1.5 rounded-lg font-medium ${i === 0 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-600'}">${s.datetime}${i === 0 ? ' ⭐ Recommended' : ''}</span>
      `).join('')}</div>
      <p class="text-xs text-gray-400 mt-2">Recommended slot has the lowest predicted wait time.</p>`;
  }

  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'done', contextHTML) + agentStepHTML(AGENT_DEFS[1], 'done', hospHTML) + agentStepHTML(AGENT_DEFS[2], 'done', docHTML) + agentStepHTML(AGENT_DEFS[3], 'done', slotHTML);

  // ── Agent 5: Recommendation ──
  stepsEl.innerHTML += agentStepHTML(AGENT_DEFS[4], 'active');
  await delay(1800);

  let recContent = '';
  if (topDoctors.length && topHospitals.length) {
    const bestDoc = topDoctors[0];
    const bestHosp = topHospitals[0];
    const altDoc = topDoctors.length > 1 ? topDoctors[1] : null;
    recContent = `
      <p class="text-xs text-gray-500 mb-2">Recommendation analysis complete:</p>
      <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
        <p class="font-semibold text-green-800 mb-1">Primary Recommendation</p>
        <p class="text-green-700"><strong>${bestDoc.name}</strong> at <strong>${bestDoc.hospital_name}</strong> — ₹${bestDoc.fee} consultation, ${bestDoc.rating} ★ rating, ${bestDoc.experience_years} years experience.</p>
        ${altDoc ? `<p class="text-xs text-gray-500 mt-2">Alternative: ${altDoc.name} at ${altDoc.hospital_name} (₹${altDoc.fee}, ${altDoc.rating} ★)${altDoc.fee < bestDoc.fee ? ' — cheaper option' : altDoc.rating > bestDoc.rating ? ' — higher rated' : ''}.</p>` : ''}
      </div>`;
  } else {
    recContent = '<p class="text-sm text-gray-500">Unable to generate recommendation. Try a different query.</p>';
  }

  stepsEl.innerHTML = agentStepHTML(AGENT_DEFS[0], 'done', contextHTML) + agentStepHTML(AGENT_DEFS[1], 'done', hospHTML) + agentStepHTML(AGENT_DEFS[2], 'done', docHTML) + agentStepHTML(AGENT_DEFS[3], 'done', slotHTML) + agentStepHTML(AGENT_DEFS[4], 'done', recContent);

  // ── Final recommendation card ──
  if (topDoctors.length) {
    const bestDoc = topDoctors[0];
    const slots = await api(`/api/doctors/${bestDoc.doctor_id}/slots`);
    const bestSlot = slots.find(s => s.available);
    recEl.classList.remove('hidden');
    recEl.innerHTML = `
      <div class="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl p-6 text-white mt-6">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          <h3 class="text-lg font-bold">AI Recommendation</h3>
        </div>
        <p class="text-primary-100 mb-4">Based on your query, all 5 agents recommend:</p>
        <div class="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
          <div class="flex items-center gap-4">
            <img src="${bestDoc.image}" class="w-14 h-14 rounded-full border-2 border-white/30" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(bestDoc.name)}&size=56&background=dbeafe&color=1d4ed8'" />
            <div>
              <p class="font-bold text-lg">${bestDoc.name}</p>
              <p class="text-primary-100 text-sm">${bestDoc.specialty} &middot; ${bestDoc.hospital_name}</p>
              <p class="text-primary-100 text-sm">₹${bestDoc.fee} &middot; ${bestDoc.rating} ★ &middot; ${bestDoc.experience_years} yrs exp</p>
            </div>
          </div>
          ${bestSlot ? `<p class="text-sm mt-3 text-primary-100">Recommended slot: <span class="font-semibold text-white">${bestSlot.datetime}</span></p>` : ''}
        </div>
        <div class="flex gap-3">
          <button onclick="navigate('doctor-detail', {id:'${bestDoc.doctor_id}'})" class="bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition">Book This Doctor</button>
          <button onclick="navigate('doctors', {specialty:'${parsed.specialty}'})" class="border border-white/30 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition">See All ${parsed.specialty} Doctors</button>
        </div>
      </div>`;
  }

  btn.disabled = false;
  btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg> Run Agents';
}

// ── Init ────────────────────────────────────────────────────────────────────
updateAuthUI();
navigate('home');
