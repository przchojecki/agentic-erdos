# Harder Batch 12: Web + Compute

Batch: `EP-406, EP-408, EP-409, EP-410, EP-411, EP-413, EP-416, EP-431, EP-450, EP-470`

Computation artifact:
- `data/harder_batch12_quick_compute.json`

## Per-problem quick outcomes

### EP-406
- Quick literature check:
  - Saye (2022) gives extremely large computational verification ranges for ternary-digit behavior of powers of two.
- Finite compute signal:
  - Up to exponent `20000`, only `n=0,2,8` give ternary digits in `{0,1}` for `2^n`.
  - For digits in `{1,2}`, only `n=0,1,2,3,4,15` appear in this range.
- Interpretation:
  - Finite data strongly matches the conjectural finiteness picture.

### EP-408
- Quick literature check:
  - Core distribution-function/normal-order questions remain tied to deep distribution hypotheses.
- Finite compute signal:
  - For `n<=3e5`, `f(n)/log n` stabilizes around mean `~1.258` with shrinking variance.
  - Coarse check on largest prime factor of `phi_k(n)` at `k~log log n` shows substantial compression relative to `n` in tested scale.
- Interpretation:
  - Numerics support a concentrated normal-order regime for iterated-totient depth.

### EP-409
- Quick literature check:
  - Problem remains partly ambiguous in formulation; finite-iteration growth and terminal-prime basin questions are still natural.
- Finite compute signal:
  - For `n<=3e5`, mean iterations before hitting a prime under `n->phi(n)+1` is about `3.98`, max observed `23`.
  - Terminal-prime basins are highly nonuniform, with large finite attractor classes.
- Interpretation:
  - Iteration counts grow slowly; basin structure appears rich and irregular.

### EP-410
- Quick literature check:
  - No complete resolution known in the cited background.
- Finite compute signal:
  - For sample seeds, `sigma_k(n)^{1/k}` and `log sigma_k(n)/k` both trend upward over 12 steps.
- Interpretation:
  - Finite trajectories are consistent with super-exponential-in-`k` growth heuristics for iterates.

### EP-411
- Quick literature check:
  - 2025 work (Steinerberger/Cambie context) reframes the `r=2` case via explicit totient equations and arithmetic restrictions.
- Finite compute signal:
  - Windowed search up to `n<=20000` finds many candidates for `r=2` with eventual doubling behavior; known examples (`n=10,94`) verify on long windows.
- Interpretation:
  - Finite dynamics suggest broad structured families, but a complete parameterization by `(n,r)` remains open.

### EP-413
- Quick literature check:
  - Barrier questions for additive arithmetic functions remain open in the strongest forms.
- Finite compute signal:
  - For `eps=1`, barriers are sparse (`~0.7%` density up to `5e5`).
  - For reduced coefficients (`eps=0.5, 0.25`), barrier density increases sharply in finite range.
- Interpretation:
  - Data supports the plausibility of many weakened-barrier variants while full `eps=1` remains subtle.

### EP-416
- Quick literature check:
  - Modern near-sharp formulas for totient-image size still leave key asymptotic-ratio questions open.
- Finite compute signal:
  - Proxy counts from `m<=1e6` show `V(2X)/V(X)` around `1.9` on moderate scales.
- Interpretation:
  - Finite behavior is compatible with near-linear scaling but does not settle existence of an exact doubling limit.

### EP-431
- Quick literature check:
  - Best known inverse-Goldbach obstructions (Elsholtz-Harper) remain the main quantitative evidence; 2023 Tao-Ziegler is related but weaker structurally.
- Finite compute signal:
  - Random bounded-size sets `A,B` in finite windows cover only a minority of primes (`<=~28%` best in tested random runs at size 50x50).
- Interpretation:
  - Finite heuristic strongly reflects the difficulty of covering almost all primes by a two-set sumset.

### EP-450
- Quick literature check:
  - Ford (2008) distribution results drive current understanding; quantifier interpretation in the original question remains delicate.
- Finite compute signal:
  - For tested `n` and `y`, interval densities of numbers having a divisor in `(n,2n)` remain bounded away from `0` uniformly over scanned `x` windows.
- Interpretation:
  - Empirics align with the idea that demanding very small density for all `x` is often impossible in broad parameter regimes.

### EP-470
- Quick literature check:
  - Recent computations push odd-weird nonexistence very high (far beyond feasible brute force here).
- Finite compute signal:
  - Exhaustive weird search up to `30000` finds `57` weird numbers and `9` primitive weird numbers.
  - Odd-candidate screen up to `300000` (with strong necessary prefilter) finds no odd weird number.
- Interpretation:
  - Finite data matches known expectations: weird numbers are plentiful (mostly even), odd weirds remain elusive.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/406
  - https://www.erdosproblems.com/408
  - https://www.erdosproblems.com/409
  - https://www.erdosproblems.com/410
  - https://www.erdosproblems.com/411
  - https://www.erdosproblems.com/413
  - https://www.erdosproblems.com/416
  - https://www.erdosproblems.com/431
  - https://www.erdosproblems.com/450
  - https://www.erdosproblems.com/470
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2203.00537
  - https://arxiv.org/abs/2407.15401
  - https://arxiv.org/abs/2503.11356
  - https://arxiv.org/abs/2202.10396
  - https://arxiv.org/abs/2508.05283
