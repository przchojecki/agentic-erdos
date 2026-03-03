# Harder Batch 11: Web + Compute

Batch: `EP-365, EP-368, EP-371, EP-373, EP-374, EP-376, EP-377, EP-387, EP-393, EP-396`

Computation artifact:
- `data/harder_batch11_quick_compute.json`

## Per-problem quick outcomes

### EP-365
- Quick literature check:
  - The first-form question is already false (classical counterexamples and infinite non-Pell-type families are known); growth-rate side is still of interest.
- Finite compute signal:
  - Up to `3e6`, found pair starts `8, 288, 675, 9800, 12167, ...`.
  - First both-nonsquare pair appears at `12167` (matching known background phenomenon).
- Interpretation:
  - Data matches the known structure: non-square consecutive powerful pairs exist but are sparse.

### EP-368
- Quick literature check:
  - Recent unconditional lower progress includes Pasten (2024), still far from conjectural `(\log n)^2` scale.
- Finite compute signal:
  - For `n<=3e6`, proportion with `F(n)=P(n(n+1)) <= (\log n)^2` drops from `~6.9%` at `1e4` to `~0.63%` at `3e6`.
- Interpretation:
  - Finite trend supports growth of `F(n)` and rarity of very-small-largest-prime-factor events.

### EP-371
- Quick literature check:
  - Modern work gives logarithmic-density and almost-all-scales support; best unconditional asymptotic-density lower bound is still below `1/2`.
- Finite compute signal:
  - Prefix density of `{n: P(n)<P(n+1)}` is near `0.5001` by `n=3e6`.
- Interpretation:
  - Strong computational support for density `1/2`, consistent with current theory direction.

### EP-373
- Quick literature check:
  - Full unconditional finiteness remains open in strongest form; ABC-conditional finiteness and quantitative sparse bounds are known.
- Finite compute signal:
  - Search recovered only known nontrivial low-factor identities in tested ranges:
    - `10! = 7! 6!`
    - `10! = 7! 5! 3!`
    - `16! = 14! 5! 2!`
- Interpretation:
  - Finite search reinforces scarcity and aligns with classical conjectural finite-list behavior.

### EP-374
- Quick literature check:
  - Best structural information (including emptiness for `k>6`) is classical; detailed asymptotics for `D_3..D_6` remain open.
- Finite compute signal:
  - Exact parity-signature computation up to `m<=600` gives:
    - `|D_2\cap[1,600]|=23`
    - `|D_3\cap[1,600]|=64`
    - no primes detected in `D_2\cup D_3`.
- Interpretation:
  - Confirms low-level structural constraints; `k>=4` asymptotic regime remains the hard part.

### EP-376
- Quick literature check:
  - Strong recent progress for large-prime analogues exists, but the specific `105=3*5*7` infinitude remains open.
- Finite compute signal:
  - Using the no-carry digit criterion, only `12` hits up to `2e6`; first terms include `1,10,756,757,3160,...`.
- Interpretation:
  - Finite data indicates extreme sparsity; no sign of closure either way on infinitude.

### EP-377
- Quick literature check:
  - Core conjectural boundedness remains unresolved; classical average-value results still central.
- Finite compute signal:
  - For `n<=20000`, average of `f(n)=\sum_{p<=n, p\nmid \binom{2n}{n}}1/p` is around `0.46`; max observed about `1.179`.
- Interpretation:
  - Finite profile is compatible with boundedness heuristics but far from a uniform proof.

### EP-387
- Quick literature check:
  - Stronger old conjecture was disproved; constant-fraction interval version remains open.
- Finite compute signal:
  - For tested window (`n<=600`, `k<=20`), every pair had a divisor in `(0.5n,n]` (and even in `(n-k,n]`).
- Interpretation:
  - Small-parameter behavior is very favorable, but this does not constrain hard large-`k` regimes.

### EP-393
- Quick literature check:
  - Recent quantitative counting bounds improve known sparsity, while exact behavior of minimal gap function remains open.
- Finite compute signal:
  - Proxy searches found:
    - `n!=x(x+1)` only at `n=2,3` (up to `n=1000`)
    - `n!=x(x+1)(x+2)` at `n=3,4,5,6` (up to `n=200`).
- Interpretation:
  - Very short-gap consecutive-product realizations appear exceptionally rare.

### EP-396
- Quick literature check:
  - Pomerance (2014) gives strong one-shift divisibility results; full descending-product divisibility for each fixed `k` remains open.
- Finite compute signal:
  - Search up to `n=8000` found first hits:
    - `k=0`: `n=2`
    - `k=1`: `n=2`
    - `k=2`: `n=2480`
    - no hit for `k=3..8` in range.
- Interpretation:
  - Numerical evidence suggests rapidly increasing difficulty as `k` grows.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/365
  - https://www.erdosproblems.com/368
  - https://www.erdosproblems.com/371
  - https://www.erdosproblems.com/373
  - https://www.erdosproblems.com/374
  - https://www.erdosproblems.com/376
  - https://www.erdosproblems.com/377
  - https://www.erdosproblems.com/387
  - https://www.erdosproblems.com/393
  - https://www.erdosproblems.com/396
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2405.06079
  - https://arxiv.org/abs/2508.05282
  - https://arxiv.org/abs/2508.05283
