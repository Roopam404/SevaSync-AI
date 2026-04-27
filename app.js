// 🔥 IMPORTS (REQUIRES type="module" in HTML)
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= GLOBAL =================
let currentFilter = "All";
let allCases = [];

// ================= ANALYZE =================
async function analyze() {
  const input = document.getElementById("input").value.toLowerCase();
  const location = document.getElementById("locationInput").value || "Unknown Location";

  if (input.trim() === "") {
    alert("Please enter a situation");
    return;
  }

  let result = {
    urgency: "Medium",
    needs: [],
    volunteers_needed: 3,
    summary: "Situation requires attention"
  };

  if (input.includes("flood") || input.includes("no food")) {
    result.urgency = "High";
    result.needs = ["Food", "Water"];
    result.volunteers_needed = 5;
    result.summary = "Critical shortage of basic needs";
  }

  if (input.includes("medical") || input.includes("injured")) {
    result.urgency = "High";
    result.needs = ["Medical"];
    result.volunteers_needed = 4;
    result.summary = "Immediate medical assistance required";
  }

  if (input.includes("water") && !result.needs.includes("Water")) {
    result.needs.push("Water");
  }

  // 🎨 UI UPDATE
  document.getElementById("urgencyText").innerText =
    result.urgency === "High"
      ? "🔴 HIGH PRIORITY"
      : result.urgency === "Medium"
      ? "🟡 MEDIUM PRIORITY"
      : "🟢 LOW PRIORITY";

  document.getElementById("locationText").innerText = location;
  document.getElementById("volText").innerText = result.volunteers_needed;
  document.getElementById("summaryText").innerText = result.summary;

  const tags = document.getElementById("needsTags");
  tags.innerHTML = "";
  result.needs.forEach(n => {
    const span = document.createElement("span");
    span.innerText = "✔ " + n;
    tags.appendChild(span);
  });

  document.getElementById("resultBox").classList.remove("hidden");

  // 💾 SAVE
  await addDoc(collection(db, "cases"), {
    description: input,
    urgency: result.urgency,
    needs: result.needs,
    volunteers_needed: result.volunteers_needed,
    summary: result.summary,
    status: "Pending",
    location: location,
    createdAt: new Date()
  });

  loadDashboard();
  loadCases();
}

// ================= DASHBOARD =================
async function loadDashboard() {
  const querySnapshot = await getDocs(collection(db, "cases"));

  let high = 0, medium = 0, low = 0, totalVol = 0;

  querySnapshot.forEach(doc => {
    const d = doc.data();

    if (d.urgency === "High") high++;
    else if (d.urgency === "Medium") medium++;
    else low++;

    totalVol += d.volunteers_needed || 0;
  });

  document.getElementById("high").innerText = high;
  document.getElementById("medium").innerText = medium;
  document.getElementById("low").innerText = low;
  document.getElementById("total").innerText = high + medium + low;
}

// ================= CASES =================
async function loadCases() {
  const snapshot = await getDocs(collection(db, "cases"));

  allCases = [];

  snapshot.forEach(docSnap => {
    allCases.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  applyFilters();
}

function applyFilters() {
  const container = document.getElementById("casesTableBody");
  const searchInput = document.getElementById("searchInput");

  const search = searchInput ? searchInput.value.toLowerCase() : "";

  container.innerHTML = "";

  allCases.forEach(data => {
    const matchesSearch = data.description.toLowerCase().includes(search);
    const matchesFilter = currentFilter === "All" || data.urgency === currentFilter;

    if (!matchesSearch || !matchesFilter) return;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.urgency}</td>
      <td>${data.description}</td>
      <td>${data.needs.join(", ")}</td>
      <td>${data.volunteers_needed}</td>
      <td>${data.status}</td>
      <td>${data.location || "Unknown"}</td>
      <td>${formatTime(data.createdAt)}</td>
      <td>
        ${
          data.status !== "Resolved"
            ? `<button onclick="resolveCase('${data.id}')">Resolve</button>`
            : "✔"
        }
      </td>
    `;

    container.appendChild(row);
  });
}

// ================= VOLUNTEERS =================
function loadVolunteers() {
  const container = document.getElementById("volList");

  const volunteers = [
    { name: "Rahul Patel", status: "Available" },
    { name: "Ananya Singh", status: "Assigned" },
    { name: "Amit Sharma", status: "Available" }
  ];

  container.innerHTML = "";

  volunteers.forEach(v => {
    const div = document.createElement("div");
    div.className = "vol-card";

    div.innerHTML = `
      <div class="vol-name">${v.name}</div>
      <div class="vol-status">${v.status}</div>
    `;

    container.appendChild(div);
  });
}

// ================= ANALYTICS (REAL-TIME) =================
function loadAnalytics() {
  const loader = document.getElementById("analyticsLoader");
  if (loader) loader.style.display = "block";

  onSnapshot(collection(db, "cases"), snapshot => {
    let high = 0, medium = 0, low = 0;

    snapshot.forEach(doc => {
      const d = doc.data();

      if (d.urgency === "High") high++;
      else if (d.urgency === "Medium") medium++;
      else low++;
    });

    document.getElementById("highCount").innerText = high;
    document.getElementById("mediumCount").innerText = medium;
    document.getElementById("lowCount").innerText = low;

    Chart.getChart("caseChart")?.destroy();
    Chart.getChart("volChart")?.destroy();

    renderCharts(high, medium, low);

    if (loader) loader.style.display = "none";
  });
}

function renderCharts(high, medium, low) {
  new Chart(document.getElementById("caseChart"), {
    type: "doughnut",
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [{
        data: [high, medium, low],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"]
      }]
    },
    options: {
      animation: { duration: 1200 }
    }
  });

  new Chart(document.getElementById("volChart"), {
    type: "bar",
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [{
        label: "Cases",
        data: [high, medium, low]
      }]
    }
  });
}

// ================= HELPERS =================
function formatTime(timestamp) {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleString();
}

// ================= FILTER =================
function setFilter(type, btn) {
  currentFilter = type;

  document.querySelectorAll(".filter-btn").forEach(b =>
    b.classList.remove("active")
  );

  btn.classList.add("active");

  applyFilters();
}

// ================= NAVIGATION =================
function showPage(pageId, event) {
  document.querySelectorAll(".page").forEach(p => {
    p.style.display = "none";
  });

  const page = document.getElementById(pageId);
  if (page) page.style.display = "block";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  if (event) event.target.classList.add("active");

  if (pageId === "analyticsPage") loadAnalytics();
  if (pageId === "volunteersPage") loadVolunteers();
}

// ================= RESOLVE =================
async function resolveCase(id) {
  const ref = doc(db, "cases", id);

  await updateDoc(ref, {
    status: "Resolved"
  });

  loadCases();
  loadDashboard();
}



// ================= GLOBAL EXPORT =================
window.analyze = analyze;
window.showPage = showPage;
window.resolveCase = resolveCase;
window.setFilter = setFilter;

// ================= INIT =================
window.onload = () => {
  console.log("App Loaded ✅");

  showPage("homePage");
  loadDashboard();
  loadCases();
};