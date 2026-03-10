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

function extractAnySection(md, headings) {
  for (const h of headings) {
    const v = extractSection(md, h);
    if (v) return v;
  }
  return "";
}

function stripBatchSections(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let skip = false;
  for (const line of lines) {
    if (/^##\s+/i.test(line)) {
      skip = /^##\s+Batch /i.test(line);
      if (!skip) out.push(line);
      continue;
    }
    if (!skip) out.push(line);
  }
  return out.join("\n").trim();
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
    const payload = c?.data ?? c;
    const payloadText = JSON.stringify(payload, null, 2);
    const shortText =
      payloadText.length > 1200 ? `${payloadText.slice(0, 1200)}\n...` : payloadText;
    div.innerHTML = `
      <div><strong>${c.kind || "computation"}</strong></div>
      <div class="comp-kind">generated: ${c.generated_utc || "n/a"}</div>
      <details>
        <summary>View Computation Data</summary>
        <pre class="note-raw">${shortText.replace(/[<>&]/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[m]))}</pre>
      </details>
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
    setText("statement", "");
    setText("literature", "");
    setText("approachProven", "");
    setText("noteRaw", "");
    $("computations").textContent = "";
    return;
  }

  const data = await dataRes.json();
  const noteRaw = await noteRes.text();
  const note = stripBatchSections(noteRaw);

  let statement = extractAnySection(note, ["Statement", "Statement split", "Working statement"]);
  if (!statement) statement = "Problem statement not yet normalized in this note.";

  const literature = [
    extractAnySection(note, [
      "Literature status (checked)",
      "References",
      "References (checked in this deep dive)",
    ]),
  ]
    .filter(Boolean)
    .join("\n\n");

  const approachProven = [
    extractAnySection(note, ["Route"]),
    extractAnySection(note, ["What is resolved"]),
    extractAnySection(note, ["Proof route sharpened"]),
    extractAnySection(note, ["Attempt in this batch"]),
    extractAnySection(note, ["Status"]),
    extractAnySection(note, ["What remains open in this note"]),
  ]
    .filter(Boolean)
    .join("\n\n");

  setText("problemTitle", data.problem || `EP-${id}`);
  setText("statement", statement || "No parsed statement section found.");
  setText("literature", literature || "No explicit literature section found.");
  setText("approachProven", approachProven || "No explicit approach/proven section found.");
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
