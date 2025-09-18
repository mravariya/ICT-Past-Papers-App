let data = [];
let filteredData = [];

document.addEventListener("DOMContentLoaded", () => {
  Papa.parse("data.csv", {
    download: true,
    header: true,
    complete: function(results) {
      data = results.data;
      filteredData = data;
      populateFilters();
      renderTable();
    }
  });

  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("chapterFilter").addEventListener("change", applyFilters);
  document.getElementById("aoFilter").addEventListener("change", applyFilters);
  document.getElementById("paperFilter").addEventListener("change", applyFilters);
  document.getElementById("resetFilters").addEventListener("click", resetFilters);

  document.querySelectorAll("input[name='view']").forEach(radio => {
    radio.addEventListener("change", toggleView);
  });
});

function populateFilters() {
  populateSelect("chapterFilter", [...new Set(data.map(d => d.Chapter))]);
  populateSelect("aoFilter", [...new Set(data.map(d => d.AO))]);
  populateSelect("paperFilter", [...new Set(data.map(d => d["Paper Code"]))]);
}

function populateSelect(id, options) {
  const select = document.getElementById(id);
  options.filter(Boolean).forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const chapter = document.getElementById("chapterFilter").value;
  const ao = document.getElementById("aoFilter").value;
  const paper = document.getElementById("paperFilter").value;

  filteredData = data.filter(d =>
    (!chapter || d.Chapter === chapter) &&
    (!ao || d.AO === ao) &&
    (!paper || d["Paper Code"] === paper) &&
    Object.values(d).some(v => v && v.toLowerCase().includes(search))
  );

  renderTable();
}

function resetFilters() {
  document.getElementById("search").value = "";
  document.getElementById("chapterFilter").value = "";
  document.getElementById("aoFilter").value = "";
  document.getElementById("paperFilter").value = "";
  filteredData = data;
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#questionsTable tbody");
  tbody.innerHTML = "";
  filteredData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.Chapter}</td>
      <td>${row.Subtopic}</td>
      <td>${row["Question Number"]}</td>
      <td>${row.Question}</td>
      <td>${row.Strategy}</td>
      <td class="answerCol">${row.Answer}</td>
      <td>${row.AO}</td>
      <td>${row.Marks}</td>
      <td>${row["Paper Code"]}</td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleView() {
  const view = document.querySelector("input[name='view']:checked").value;
  const answerCols = document.querySelectorAll(".answerCol");
  answerCols.forEach(col => {
    col.style.display = (view === "qs") ? "none" : "table-cell";
  });
  renderTable();
}
