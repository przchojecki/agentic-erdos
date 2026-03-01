# EP-820 deeper attempt

## Statement
Study `H(n)`: smallest `l` with some `k<l` and `gcd(k^n-1,l^n-1)=1`. In particular, whether
`H(n)=3` infinitely often.

## Core reduction used
`H(n)=3` is exactly equivalent to

`gcd(2^n-1,3^n-1)=1`,

since `l=3` forces `k=2`.

Define for each prime `p>3`:

`m_p := lcm(ord_p(2), ord_p(3))`.

Then the equivalent arithmetic form is:

`H(n)=3  <=>  n` is not divisible by any `m_p`.

Reason: `p | gcd(2^n-1,3^n-1)` iff both orders divide `n`, i.e. iff `m_p | n`.

## Conditional theorem (proved as reduction)
If the divisor-moduli family `{m_p : p>3}` is not a covering system of the positive integers
(equivalently: infinitely many `n` avoid all `m_p`), then `H(n)=3` infinitely often.

So the infinitude problem is reduced to a covering-system question for `{m_p}`.

## Exact finite computation in this focused attempt
I ran exact BigInt recurrence scans for the `H(n)=3` indicator and separate direct searches for
full `H(n)` values on smaller ranges.

Data files:
- `data/ep820_h3_density_scan.json` (`1<=n<=20000`, exact `H(n)=3` indicator)
- `data/ep820_h3_structure_scan.json` (`1<=n<=12000`, witness-prime decomposition)
- `data/ep820_uncovered_largeprime_witnesses.json` (explicit large-prime witnesses)
- `data/ep820_order_moduli_covering_metrics_fast.json` (finite covering progression for `p` cutoffs)
- `data/ep820_Hn_scan.json` (`1<=n<=160`, base search cap `l<=260`, full `H(n)` search)
- `data/ep820_Hn_unresolved_extension_to700.json` (extended hard cases to `l<=700`)

Key finite facts:
- Up to `n=20000`, `H(n)=3` occurs `8075` times (density `0.40375`).
- Checkpoint densities decrease slowly:
  `0.43` (1000), `0.425` (2000), `0.416` (5000), `0.4089` (10000), `0.40375` (20000).
- Maximum observed gap between consecutive `H(n)=3` hits is only `14` (up to 20000).
- On `n<=12000`, most non-hits are explained by prime-order witnesses
  `m_p = lcm(ord_p(2),ord_p(3))`; with witness primes up to `10^6`, only `3/7123` misses were
  initially uncovered, and each of those was matched by a larger explicit prime witness.
- Finite cutoff-covering progression (`n<=12000`) shows monotone explanation growth:
  using primes `p<=3000`, about `91.8%` of actual misses are already explained by corresponding
  `m_p` divisibility constraints.
- First 10 values match background: `3,3,3,6,3,18,3,6,3,12`.
- Some `n` need very large `l` (e.g. `H(48)=455`, `H(66)=469`, `H(80)=510` found in extension).
- Even after `l<=700`, unresolved values remain (e.g. `n=36,60,72,...,156`).

## Interpretation
This gives strong exact finite evidence that `H(n)=3` is frequent (around 40% through 20000),
while full `H(n)` still has large spikes. It still does not constitute an infinite proof.
