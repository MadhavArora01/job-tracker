let applications = [];

function addApplication() {
  const jobTitle = document.getElementById('job-title').value.trim();
  const company = document.getElementById('company').value.trim();
  const location = document.getElementById('location').value.trim();
  const status = document.getElementById('status').value;

  if (!jobTitle || !company) {
    alert('Please enter at least a job title and company name.');
    return;
  }

  const newApp = {
    id: Date.now(),
    jobTitle: jobTitle,
    company: company,
    location: location,
    status: status,
    dateAdded: new Date().toLocaleDateString('en-GB')
  };

  applications.push(newApp);
  saveToStorage();
  renderApplications();
  updateStats();

  document.getElementById('job-title').value = '';
  document.getElementById('company').value = '';
  document.getElementById('location').value = '';
}

function updateStatus(id, newStatus) {
  const app = applications.find(a => a.id === id);
  if (app) {
    app.status = newStatus;
    saveToStorage();
    renderApplications();
    updateStats();
  }
}

function deleteApplication(id) {
  applications = applications.filter(a => a.id !== id);
  saveToStorage();
  renderApplications();
  updateStats();
}

function renderApplications() {
  const list = document.getElementById('applications-list');

  if (applications.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No applications yet. Add your first one above!</p></div>';
    return;
  }

  list.innerHTML = applications.map(app => `
    <div class="app-card">
      <div class="app-info">
        <h3>${app.jobTitle}</h3>
        <p>${app.company} ${app.location ? '· ' + app.location : ''} · Added ${app.dateAdded}</p>
      </div>
      <div class="app-right">
        <span class="status-badge status-${app.status.replace(' ', '-')}">${app.status}</span>
        <select class="status-select" onchange="updateStatus(${app.id}, this.value)">
          <option value="Applied"      ${app.status === 'Applied'      ? 'selected' : ''}>Applied</option>
          <option value="Screening"    ${app.status === 'Screening'    ? 'selected' : ''}>Screening</option>
          <option value="Interview"    ${app.status === 'Interview'    ? 'selected' : ''}>Interview</option>
          <option value="Final Stage"  ${app.status === 'Final Stage'  ? 'selected' : ''}>Final Stage</option>
          <option value="Offer"        ${app.status === 'Offer'        ? 'selected' : ''}>Offer</option>
          <option value="Rejected"     ${app.status === 'Rejected'     ? 'selected' : ''}>Rejected</option>
        </select>
        <button class="delete-btn" onclick="deleteApplication(${app.id})">✕</button>
      </div>
    </div>
  `).join('');
}

function updateStats() {
  document.getElementById('total-count').textContent = applications.length;
  document.getElementById('interview-count').textContent =
    applications.filter(a => a.status === 'Interview' || a.status === 'Final Stage').length;
  document.getElementById('offer-count').textContent =
    applications.filter(a => a.status === 'Offer').length;
}

function saveToStorage() {
  localStorage.setItem('jobApplications', JSON.stringify(applications));
}

function loadFromStorage() {
  const saved = localStorage.getItem('jobApplications');
  if (saved) {
    applications = JSON.parse(saved);
  }
}

loadFromStorage();
renderApplications();
updateStats();