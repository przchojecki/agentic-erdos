# Harder Batch 24: Web + Compute

Batch: `EP-1063, EP-1065, EP-1066, EP-1068, EP-1070, EP-1072, EP-1073, EP-1074, EP-1083, EP-1084`

Computation artifact:
- `data/harder_batch24_quick_compute.json`

Method note:
- Applied `cycle-method.md`: each item uses a targeted finite mechanism probe plus an explicit bottleneck statement.

## Per-problem quick outcomes

### EP-1063
- Quick literature check:
  - Page remains open (edited 01 Feb 2026), with known initial values and exponential-type upper bounds.
- Finite compute signal:
  - Exact search for `k<=12` recovers `n_2=4, n_3=6, n_4=9, n_5=12`; finite values for larger `k` are highly non-monotone in this range.
- Interpretation:
  - Finite exact data supports irregular local behavior; asymptotic order of `n_k` remains unresolved.

### EP-1065
- Quick literature check:
  - Open (edited 30 Sep 2025); no listed resolution for infinitude in either prime form.
- Finite compute signal:
  - For primes up to `1.2e6`, substantial fractions satisfy `p=2^a q+1` (with prime `q`) and the broader `2^a3^b q+1` form.
- Interpretation:
  - Positive finite densities suggest abundance in tested ranges but do not prove infinitude.

### EP-1066
- Quick literature check:
  - Open (edited 02 Oct 2025), with current bounds roughly `0.258n <= g(n) <= 0.3125n`.
- Finite compute signal:
  - Induced-subgraph samples from triangular-lattice unit-distance contact graphs gave `alpha/n` minima around `0.47..0.54` on tested finite windows.
- Interpretation:
  - Finite induced models are consistent with linear-scale independent sets; they do not directly target worst-case constructions.

### EP-1068
- Quick literature check:
  - Open (edited 18 Jan 2026); page notes this is a later "version" entry and records modern related counterexample-style context.
- Finite compute signal:
  - Finite proxy on `C5` and first two Mycielski lifts shows rising finite chromatic complexity (`chi=3,4,5`) and nontrivial connectivity profiles.
- Interpretation:
  - This finite analogue captures high-chromatic/connected tension, but does not address the countable-subgraph infinite-connectivity statement itself.

### EP-1070
- Quick literature check:
  - Open (edited 22 Jan 2026), with updated upper bound `f(n) <= (1/4+o(1))n` and classic spindle upper-construction context.
- Finite compute signal:
  - Disjoint spindle construction gives stable finite ratio `alpha/n = 2/7`.
- Interpretation:
  - Finite construction reproduces the classical upper-barrier pattern; no progress toward the `n/4` lower target.

### EP-1072
- Quick literature check:
  - Open (edited 04 Oct 2025), still focused on behavior of `f(p)` relative to `p`.
- Finite compute signal:
  - Exact modular-factorial scan for primes `<=50000` finds `f(p)=p-1` for about `0.35..0.38` of sampled primes; mean `f(p)/p` near `0.60`.
- Interpretation:
  - Finite rates are informative but not asymptotic evidence for the two stated limit questions.

### EP-1073
- Quick literature check:
  - Open (edited 06 Oct 2025), with OEIS anchor sequence and Wilson context.
- Finite compute signal:
  - Composite-modulus scan to `x=12000` recovers initial hits (`25,121,169,437,...`) and gives decreasing `A(x)/x` in probes.
- Interpretation:
  - Finite profile is consistent with sparsity heuristics but far from proving subpolynomial growth.

### EP-1074
- Quick literature check:
  - Open (edited 04 Oct 2025), with known infinitude of both sets `S` and `P` and unresolved density limits.
- Finite compute signal:
  - Scan up to `p<=30000` yields empirical densities drifting around `|S∩[1,x]|/x ~ 0.18` (at `x=5000`) and `|P∩[1,x]|/pi(x) ~ 0.52` (at `x=30000`).
- Interpretation:
  - Finite trends are non-monotone and range-sensitive; no decisive evidence on existence/value of limiting densities.

### EP-1083
- Quick literature check:
  - Open (edited 16 Oct 2025), with current lower-bound exponents and classical lattice upper mechanism still central.
- Finite compute signal:
  - On `t x t x t` grids (`n=t^3`), distinct-distance counts scale near a constant multiple of `n^{2/3}` in tested `t`.
- Interpretation:
  - Finite lattice behavior is consistent with the conjectured `n^{2/d}`-scale upper mechanism for `d=3`.

### EP-1084
- Quick literature check:
  - Open (edited 08 Feb 2026), with `d=3` linear-minus-surface-type bounds still the main asymptotic shape.
- Finite compute signal:
  - FCC-parity block constructions show contact counts close to linear (`pairs/n` rising toward `~4.86` in tested windows) with deficits of order compatible with `n^{2/3}` surface effects.
- Interpretation:
  - Finite construction behavior supports linear-minus-boundary heuristics but is not extremal certification.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/1063
  - https://www.erdosproblems.com/1065
  - https://www.erdosproblems.com/1066
  - https://www.erdosproblems.com/1068
  - https://www.erdosproblems.com/1070
  - https://www.erdosproblems.com/1072
  - https://www.erdosproblems.com/1073
  - https://www.erdosproblems.com/1074
  - https://www.erdosproblems.com/1083
  - https://www.erdosproblems.com/1084
