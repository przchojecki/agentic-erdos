const state = {
  catalog: [],
  filtered: [],
  selectedId: null,
};

function $(id) {
  return document.getElementById(id);
}

function extractSection(md, heading) {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^##\\s+${esc}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`, "im");
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

function pick(obj, fields) {
  for (const f of fields) {
    if (obj[f]) return obj[f];
  }
  return "";
}

function renderList() {
  const host = $("problemList");
  host.innerHTML = "";

  for (const p of state.filtered) {
    const btn = document.createElement("button");
    btn.className = `problem-item${p.id === state.selectedId ? " active" : ""}`;
    btn.innerHTML = `
      <div class="problem-id">${p.problem}</div>
      <div class="problem-sub">${p.closure_state} · ${p.progress_status} · comps: ${p.computations_count}</div>
    `;
    btn.onclick = () => selectProblem(p.id);
    host.appendChild(btn);
  }
}

function setText(id, value) {
  $(id).textContent = value || "No data.";
}

function renderComputations(data) {
  const host = $("computations");
  host.innerHTML = "";
  const comps = Array.isArray(data.computations) ? data.computations : [];
  if (!comps.length) {
    host.textContent = "No computations recorded.";
    return;
  }

  for (const c of comps.slice().reverse()) {
    const div = document.createElement("div");
    div.className = "comp-item";
    div.innerHTML = `
      <div><strong>${c.kind || "computation"}</strong></div>
      <div class="comp-kind">source: ${c.source_file || "n/a"}</div>
      <div class="comp-kind">generated: ${c.generated_utc || "n/a"}</div>
    `;
    host.appendChild(div);
  }
}

async function selectProblem(id) {
  state.selectedId = id;
  renderList();

  const key = `ep${id}`;
  const [dataRes, noteRes] = await Promise.all([
    fetch(`data/${key}.json`),
    fetch(`notes/${key}.md`),
  ]);

  if (!dataRes.ok || !noteRes.ok) {
    setText("problemTitle", `EP-${id}`);
    setText("problemMeta", "Failed to load problem files.");
    setText("statement", "");
    setText("resolved", "");
    setText("references", "");
    setText("noteRaw", "");
    $("computations").textContent = "";
    return;
  }

  const data = await dataRes.json();
  const note = await noteRes.text();

  const statement =
    extractSection(note, "Statement") || extractSection(note, "Statement split") || "";
  const resolved =
    extractSection(note, "What is resolved") ||
    extractSection(note, "Status") ||
    "No explicit resolved-results section.";
  const references =
    extractSection(note, "References") ||
    extractSection(note, "References (checked in this deep dive)") ||
    "";

  setText("problemTitle", data.problem || `EP-${id}`);
  setText(
    "problemMeta",
    [
      `closure: ${data.closure_state || "open"}`,
      `progress: ${data.progress_status || (data.computations?.length ? "has_computation" : "no_progress")}`,
      `computations: ${data.computations?.length || 0}`,
    ].join(" · "),
  );

  setText("statement", statement || "No parsed statement section found.");
  setText("resolved", resolved);
  setText("references", references || "No explicit references section found.");
  setText("noteRaw", note);
  renderComputations(data);
}

function applySearch() {
  const q = $("search").value.trim().toLowerCase();
  if (!q) {
    state.filtered = state.catalog.slice();
    renderList();
    return;
  }

  state.filtered = state.catalog.filter((p) => {
    const blob = [
      p.problem,
      p.title,
      p.classification,
      p.closure_state,
      p.progress_status,
      p.statement_preview,
      p.established_preview,
      p.references_preview,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
  renderList();
}

function initTabs() {
  for (const btn of document.querySelectorAll(".tab")) {
    btn.addEventListener("click", () => {
      for (const b of document.querySelectorAll(".tab")) b.classList.remove("active");
      for (const p of document.querySelectorAll(".tab-panel")) p.classList.remove("active");
      btn.classList.add("active");
      $(btn.dataset.tab).classList.add("active");
    });
  }
}

async function init() {
  const res = await fetch("catalog.json");
  if (!res.ok) {
    setText("problemTitle", "Failed to load catalog.json");
    return;
  }
  const cat = await res.json();
  state.catalog = cat.problems || [];
  state.filtered = state.catalog.slice();
  state.selectedId = state.catalog[0]?.id || null;
  renderList();
  if (state.selectedId != null) await selectProblem(state.selectedId);

  $("search").addEventListener("input", applySearch);
  initTabs();
}

init();
