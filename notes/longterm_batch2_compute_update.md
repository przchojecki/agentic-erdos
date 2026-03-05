# Long-Term Batch 2: Overnight Compute Update (Deepened)

This update records a deeper rerun of all currently available batch-2 computation scripts.

## Completed deep runs
- EP-279: `K=3`, `N=600000`, `P_MAX=300`, `RESTARTS=160`, `TAIL_START=5000`
  - `data/ep279_residue_cover_greedy_scan.json`
  - Best covered ratio: `0.904035`; tail covered ratio: `0.90408588`; uncovered count: `57579`.

- EP-288: `MAX_N=220`, `SAMPLE_CAP=300`
  - `data/ep288_interval_singleton_scan.json`
  - Total solutions: `6`; disjoint singleton solutions: `3`; max interval length in solutions: `4`.

- EP-313: `MMAX=30000000`
  - `data/ep313_primary_pseudoperfect_scan.json`
  - Hits remain exactly `{2,6,42,1806,47058}` (count `5`).

- EP-317: `N_MAX=30`
  - `data/ep317_signed_harmonic_min_exact.json`
  - Equality case `M(n)=1/[1..n]` only at `n=3,4`; still strict for all `5<=n<=30`.
  - At `n=30`: `M(30)=13340/2329089562800`.

- EP-323: `X_LIST=10000,100000,1000000,2000000`
  - `data/ep323_power_sum_count_scan.json`
  - Added `x=2,000,000` rows for all tracked `(k,m)` pairs.

- EP-330: `N=360`, `L=360`, `U=720`, `RESTARTS=40`, `STEPS=3500`
  - `data/ep330_finite_minimal_basis_search.json`
  - Best score: `2.038888...`; full cover achieved (`cover_ratio=1`) with density `~0.5972`.
  - Bottleneck persists: `min_essential_ratio=0`, and `zero_essential_count=211`.

- EP-386: `NMAX=400000`, `KMAX=10`
  - `data/ep386_binomial_consecutive_primes_scan.json`
  - Total hits: `9`; no hits for `k=5,7,8,9,10` in scanned range.

- EP-681: `N_MAX=2000000`
  - `data/ep681_composite_lpf_k2_scan.json`
  - Total bad: `51884` (bad ratio `~0.025942` at `n=2e6`; ratio decreasing over checkpoints).

- EP-854:
  - `data/ep854_primorial_gap_scan.json` with `KMAX=9`, `N_LIMIT=230000000`
  - New row included for `k=9` (`n_k=223092870`): `max_gap=40`, all even gaps up to 40 represented.
  - `data/ep854_constructive_lower_bound_profile.json` with `KMAX=60`
  - Guaranteed constructive gap floor now tabulated through `k=60` (`guaranteed_max_even_gap=78`).
  - New explicit witness files generated for `k=41..50` (15 new `(k,t)` pairs), all with `witness_found=true`.

## Compute-backed proof ideas (upgraded)
- EP-279: coverage seems to plateau near `~0.90` despite larger finite-prefix search.
  - Proof direction: formalize a finite-prefix obstruction via weighted uncovered mass that survives all single-residue updates.

- EP-288: exact scan stability (`MAX_N` deepened, no new disjoint families) suggests rigidity.
  - Proof direction: classify all interval-singleton integer-sum solutions by denominator-divisibility constraints; show only the three disjoint templates persist.

- EP-313: no new primary pseudoperfect values up to `3e7`.
  - Proof direction: prove “near-hit” congruence exclusions for squarefree `m` with 6+ prime factors to force failure of `sum_{p|m} m/p + 1 = m`.

- EP-317: strict inequality persists strongly up to `n=30`.
  - Proof direction: use modular obstruction on scaled numerators to force `min_nonzero_numerator > 1` for all `n>=5`.

- EP-323: new rows at `x=2e6` maintain smooth normalized behavior in `count / x^{m/k}`.
  - Proof direction: convert empirical stabilization to asymptotic upper/lower constants via lattice-point counting in monotone power-sum simplices.

- EP-330: full window coverage is easy, but elementwise essentiality collapses.
  - Proof direction: separate “coverability” from “minimal-basis essentiality” and prove an unavoidable zero-essential fraction for dense finite-window surrogates.

- EP-386: no new hits for larger `k` and larger `n`.
  - Proof direction: show squarefree-consecutive-prime factorization of `C(n,k)` is impossible for fixed `k>=7` by local p-adic obstruction windows.

- EP-681: bad ratio drops as `n` grows (from checkpoint data), consistent with asymptotic rarity.
  - Proof direction: derive an upper bound on bad density by splitting `k=1` prime-shift failures and controlling higher-`k` rescue probability with least-prime-factor statistics.

- EP-854: mixed behavior (failure at `k=6`, full even coverage at `k=9`) plus many constructive witnesses.
  - Proof direction: prove a two-regime theorem: small-`k` sporadic missing-even behavior, large-`k` constructive lower bound `T_k` rising via distinct-large-prime CRT assignments.

## Artifacts
- Summary bundle: `data/longterm_batch2_compute.json`
- Experiment design: `notes/longterm_batch2_experiments.md`
- Batch list: `notes/longterm_batch2_100problems.md`
- Index: `notes/longterm_batch2_100problems_index.json`
