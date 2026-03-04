# Harder Batch 23: Web + Compute

Batch: `EP-1052, EP-1053, EP-1054, EP-1055, EP-1056, EP-1057, EP-1059, EP-1060, EP-1061, EP-1062`

Computation artifact:
- `data/harder_batch23_quick_compute.json`

## Per-problem quick outcomes

### EP-1052
- Quick literature check:
  - Still open; page still lists five known unitary perfect numbers and no odd examples.
- Finite compute signal:
  - Exact scan to `N=2,000,000` found `4` hits: `6, 60, 90, 87360`, with `0` odd hits.
- Interpretation:
  - Finite search matches the classical small list and gives no evidence on finiteness beyond known examples.

### EP-1053
- Quick literature check:
  - Open; page/background still treats large-`k` multiperfect behavior as unresolved (with reported known values up to much larger `k` outside tiny ranges).
- Finite compute signal:
  - For `n<=10^6`, exact `sigma(n)=k n` scan found maximal observed `k=4` and only a few `k>=3` cases.
- Interpretation:
  - Small-range data shows rarity of large multipliers, but is far from asymptotic claims like `k=o(log log n)`.

### EP-1054
- Quick literature check:
  - Open; page/background records Tao's comment disproof of the strongest `f(n)=o(n)` form.
- Finite compute signal:
  - Bounded search (`m<=20000`) for prefix sums of sorted divisors resolved all `n<=700` except `n=2,5`.
- Interpretation:
  - Finite behavior is consistent with the classical exceptional pair and broad representability, but does not settle growth of minimal witnesses.

### EP-1055
- Quick literature check:
  - Open; recursive prime-class question remains unresolved.
- Finite compute signal:
  - Class computation for primes `<=10^6` recovers initial sequence (`2,13,37,73,1021,...`) and reaches class `9` (first at `532801`).
- Interpretation:
  - Finite recursion is coherent with known early terms; no asymptotic conclusion on infinitude in every class.

### EP-1056
- Quick literature check:
  - Open; page records classical examples for `k=2` (`p=11`) and `k=3` (`p=17`).
- Finite compute signal:
  - Prefix-factorial collision search over primes `p<=400` finds solutions with detected size at least `k=6` (first such prime in scan: `71`).
- Interpretation:
  - Finite small-prime evidence supports existence for several `k`, but does not resolve arbitrarily large `k`.

### EP-1057
- Quick literature check:
  - Open; page includes modern lower-bound exponent improvements (latest listed through 2022).
- Finite compute signal:
  - Carmichael count via Korselt criterion up to `10^6` gives `C(x)=43` at `x=10^6`.
- Interpretation:
  - Data shows continued growth but remains tiny-density and non-diagnostic for the conjectured near-linear-exponent regime.

### EP-1059
- Quick literature check:
  - Open; listed examples remain `p=101` and `p=211`.
- Finite compute signal:
  - Prime scan to `10^6` found `7874` primes satisfying that all `p-k!` (`k!<p`) are composite; first hits begin `101, 211, 367, 409, ...`.
- Interpretation:
  - Finite range suggests many candidates, but does not establish infinitude.

### EP-1060
- Quick literature check:
  - Open; no listed closure on growth of solution multiplicity for `k sigma(k)=n`.
- Finite compute signal:
  - For `k<=300000`, max multiplicity observed is `4`; for `n<=2^16`, max multiplicity observed is `2`.
- Interpretation:
  - Finite multiplicities are modest and compatible with slow growth hypotheses, but not asymptotically decisive.

### EP-1061
- Quick literature check:
  - Open; no listed asymptotic constant result.
- Finite compute signal:
  - Counting unordered solutions to `sigma(a)+sigma(b)=sigma(a+b)` with `a+b<=x` gives `18898` by `x=12000`.
- Interpretation:
  - Finite counts grow roughly linearly-to-superlinearly at this scale; this does not determine whether a clean `~c x` law holds.

### EP-1062
- Quick literature check:
  - Open; page records classical narrow linear bounds around `0.673 n`.
- Finite compute signal:
  - Exact branch-and-bound for `n<=32` gives ratios `f(n)/n` in about `0.667..0.714`.
- Interpretation:
  - Small exact values are consistent with the known constant-band regime but too small to infer a limit value.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/1052
  - https://www.erdosproblems.com/1053
  - https://www.erdosproblems.com/1054
  - https://www.erdosproblems.com/1055
  - https://www.erdosproblems.com/1056
  - https://www.erdosproblems.com/1057
  - https://www.erdosproblems.com/1059
  - https://www.erdosproblems.com/1060
  - https://www.erdosproblems.com/1061
  - https://www.erdosproblems.com/1062
- Additional page views used for quick status checks where direct loads were unstable:
  - https://www.erdosproblems.com/forum/thread/1056
  - https://www.erdosproblems.com/forum/thread/1060
  - https://www.erdosproblems.com/favorite-problems
