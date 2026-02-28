#!/usr/bin/env node

// Frontier classifier for EP-40 based on known rigorous witnesses/results.

const Ns = [1e6, 1e8, 1e10, 1e12].map((x) => Math.floor(x));

const gFamilies = [
  { name: 'log N', g: (N) => Math.log(N) },
  { name: '(log N)^2', g: (N) => Math.log(N) ** 2 },
  { name: 'exp(sqrt(log N))', g: (N) => Math.exp(Math.sqrt(Math.log(N))) },
  { name: 'N^0.05', g: (N) => N ** 0.05 },
  { name: 'N^0.1', g: (N) => N ** 0.1 },
  { name: 'sqrt(N)/log N', g: (N) => Math.sqrt(N) / Math.log(N) },
];

// Witness W1: powers of two => A(N) ~ log_2 N, bounded representation function.
function witnessPowers2Count(N) {
  return Math.floor(Math.log2(N)) + 1;
}

// Witness W2: Erdős–Rényi Theorem 8-style growth heuristic (for any eps>0, bounded r possible with A(N) ~ N^{1/2-eps}).
function witnessErdosRenyiCount(N, eps) {
  return N ** (0.5 - eps);
}

function classifyFamily(fam) {
  const row = {
    family: fam.name,
    thresholds: {},
    sample_met_by_powers2_all_Ns: true,
    sample_met_by_ER_eps_0p05_all_Ns: true,
    sample_met_by_ER_eps_0p1_all_Ns: true,
  };

  for (const N of Ns) {
    const th = Math.sqrt(N) / fam.g(N);
    row.thresholds[String(N)] = th;

    const p2ok = witnessPowers2Count(N) >= th;
    const er05ok = witnessErdosRenyiCount(N, 0.05) >= th;
    const er10ok = witnessErdosRenyiCount(N, 0.1) >= th;

    row.sample_met_by_powers2_all_Ns = row.sample_met_by_powers2_all_Ns && p2ok;
    row.sample_met_by_ER_eps_0p05_all_Ns = row.sample_met_by_ER_eps_0p05_all_Ns && er05ok;
    row.sample_met_by_ER_eps_0p1_all_Ns = row.sample_met_by_ER_eps_0p1_all_Ns && er10ok;
  }

  row.classification = 'sample_only_not_asymptotic_proof';

  return row;
}

const output = {
  note: [
    'This classifier is numerical and sample-based (finite N only).',
    'Do not treat these rows as asymptotic proof/disproof on their own.',
    'The rigorous theorem is existence of bounded-representation sequences with exponent 1/2-eps for every eps>0 (Erdos-Renyi 1960, Theorem 8 and following note).',
    'A positive guarantee regime is still only partial (e.g. m(N)^2/N -> infinity implies unbounded limsup).',
  ],
  Ns,
  families: gFamilies.map(classifyFamily),
};

console.log(JSON.stringify(output, null, 2));
