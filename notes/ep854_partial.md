# EP-854 partial resolution

## Statement
For reduced residues modulo the primorial n_k, study which even gap sizes occur as
successive differences a_{i+1}-a_i, including first missing even size and multiplicity.

## What is resolved
Background reports explicit computation (Lacampagne-Selfridge) indicating Erdos's
initial all-even-up-to-max-gap expectation fails already at n_k=2*3*5*7*11*13.

In this batch I reproduced and extended the finite check directly:
- script: `scripts/ep854_primorial_gap_scan.mjs`
- data: `data/ep854_primorial_gap_scan.json`
- dual-method counterexample certificate at `k=6`:
  - script: `scripts/ep854_k6_dual_check.mjs`
  - data: `data/ep854_k6_dual_check.json`
  - writeup: `notes/ep854_historical_subconjecture_disproof.md`
- theorem-level partial progress:
  - writeup: `notes/ep854_fixed_even_gap_eventual_theorem.md`
  - stronger writeup: `notes/ep854_linear_gap_coverage_theorem.md`
  - constructive witness script: `scripts/ep854_construct_fixed_gap_witness.mjs`
  - sample witnesses: `data/ep854_construct_witness_k17_t20.json`,
    `data/ep854_construct_witness_k26_t32.json`
  - linear-edge sanity sweep: `data/ep854_linear_k_witness_sanity_k4_30.json`

For `k=6` (`n_k=30030`):
- `max(a_{i+1}-a_i)=22`
- missing even gap up to max: `20`

So the "all even gaps up to max" expectation is explicitly false at this modulus.

In the same scan window:
- `k=7` (`n_k=510510`): no missing even gap up to max (`26`)
- `k=8` (`n_k=9699690`): missing even gap `32` up to max (`34`)
- `k=9` (`n_k=223092870`): no missing even gap up to max (`40`)

## What remains open in this note
No general asymptotic estimate is provided for the first missing even size or for the
count of represented even sizes relative to the maximal gap.

The theorem in `notes/ep854_fixed_even_gap_eventual_theorem.md` proves:
for each fixed even `t`, gap `t` appears for all sufficiently large `k`.
Equivalently, the smallest missing even gap tends to infinity with `k`.

The stronger theorem in `notes/ep854_linear_gap_coverage_theorem.md` proves:
- for every `k>=4`, every even `t<=k` is represented;
- for every `epsilon>0`, all even `t<=(2-epsilon)k` are represented for all
  sufficiently large `k`.

## Status
- finite computational counterexample signal to initial guess: known.
- general quantitative theory remains open.
