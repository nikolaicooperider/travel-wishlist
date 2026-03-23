import './style.css';

// ── localStorage helpers ──────────────────────────────────────────
// getDestinations reads the saved array from localStorage.
// If nothing is saved yet it returns an empty array.
function getDestinations() {
  const data = localStorage.getItem('destinations');
  return data ? JSON.parse(data) : [];
}

// saveDestinations converts the array to a JSON string and saves it.
function saveDestinations(destinations) {
  localStorage.setItem('destinations', JSON.stringify(destinations));
}

// ── Unique ID helper ──────────────────────────────────────────────
// We use the current timestamp as a simple unique ID.
function generateId() {
  return Date.now().toString();
}

// ── DOM references ────────────────────────────────────────────────
// Grab every element we need from the page once, up front.
const form             = document.getElementById('destination-form');
const formTitle        = document.getElementById('form-title');
const submitBtn        = document.getElementById('submit-btn');
const cancelBtn        = document.getElementById('cancel-btn');
const nameInput        = document.getElementById('name');
const regionInput      = document.getElementById('region');
const notesInput       = document.getElementById('notes');
const ratingInput      = document.getElementById('rating');
const filterSelect     = document.getElementById('filter-region');
const destinationsList = document.getElementById('destinations-list');
const emptyMessage     = document.getElementById('empty-message');

// ── Edit state ────────────────────────────────────────────────────
// When editingId holds an ID the form is in "edit mode".
// When it is null the form is in "add mode".
let editingId = null;

// ── Render ────────────────────────────────────────────────────────
// This is the main function. It reads all data and redraws the cards.
// We call render() any time the data changes.
function render() {
  const destinations = getDestinations();
  const filterValue  = filterSelect.value;

  // If a region filter is active, only show matching destinations.
  const filtered = filterValue
    ? destinations.filter(d => d.region === filterValue)
    : destinations;

  // Toggle the "no destinations" message.
  emptyMessage.classList.toggle('hidden', filtered.length > 0);

  // Clear old cards before drawing new ones.
  destinationsList.innerHTML = '';

  // Build one card element per destination and add it to the grid.
  filtered.forEach(dest => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-name">${dest.name}</h3>
        <span class="card-region">${dest.region}</span>
      </div>
      <p class="card-notes">${dest.notes || '<em>No notes added.</em>'}</p>
      <div class="card-footer">
        <span class="card-rating" title="${dest.rating} out of 5">${renderStars(dest.rating)}</span>
        <div class="card-actions">
          <button class="btn-edit"   data-id="${dest.id}">Edit</button>
          <button class="btn-delete" data-id="${dest.id}">Delete</button>
        </div>
      </div>
    `;
    destinationsList.appendChild(card);
  });

  // Keep the filter dropdown in sync with existing regions.
  updateFilterOptions(destinations);
}

// ── Star rating display ───────────────────────────────────────────
// Builds a string of filled (★) and empty (☆) stars.
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

// ── Sync filter dropdown ──────────────────────────────────────────
// Rebuilds the <select> options from the unique regions in the data.
function updateFilterOptions(destinations) {
  const currentFilter = filterSelect.value;
  const regions = [...new Set(destinations.map(d => d.region))].sort();

  filterSelect.innerHTML = '<option value="">All Regions</option>';
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    if (region === currentFilter) option.selected = true;
    filterSelect.appendChild(option);
  });
}

// ── Reset form to "add" mode ──────────────────────────────────────
function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent   = 'Add Destination';
  submitBtn.textContent   = 'Add Destination';
  cancelBtn.classList.add('hidden');
}

// ── Form submit: add or update ────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const destinations = getDestinations();

  // Read the current form values.
  const name   = nameInput.value.trim();
  const region = regionInput.value.trim();
  const notes  = notesInput.value.trim();
  const rating = parseInt(ratingInput.value);

  if (editingId) {
    // Edit mode: find the destination by ID and overwrite it.
    const index = destinations.findIndex(d => d.id === editingId);
    if (index !== -1) {
      destinations[index] = { id: editingId, name, region, notes, rating };
    }
  } else {
    // Add mode: create a new destination object and push it.
    destinations.push({ id: generateId(), name, region, notes, rating });
  }

  saveDestinations(destinations);
  resetForm();
  render();
});

// ── Cancel edit ───────────────────────────────────────────────────
cancelBtn.addEventListener('click', resetForm);

// ── Edit & Delete (event delegation) ─────────────────────────────
// We attach ONE listener to the grid instead of one per button.
// When a button inside the grid is clicked, we check which button it was.
destinationsList.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return; // click was not on a button with a data-id

  if (e.target.classList.contains('btn-delete')) {
    let destinations = getDestinations();
    destinations = destinations.filter(d => d.id !== id);
    saveDestinations(destinations);
    render();
  }

  if (e.target.classList.contains('btn-edit')) {
    const destinations = getDestinations();
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;

    // Populate the form with the destination's current values.
    editingId          = id;
    nameInput.value    = dest.name;
    regionInput.value  = dest.region;
    notesInput.value   = dest.notes;
    ratingInput.value  = dest.rating;

    // Switch the form to "edit" mode.
    formTitle.textContent = 'Edit Destination';
    submitBtn.textContent = 'Save Changes';
    cancelBtn.classList.remove('hidden');

    // Scroll up so the user can see the form.
    form.scrollIntoView({ behavior: 'smooth' });
  }
});

// ── Filter change ─────────────────────────────────────────────────
filterSelect.addEventListener('change', render);

// ── Initial render ────────────────────────────────────────────────
// Run render once when the page first loads so saved data appears.
render();
