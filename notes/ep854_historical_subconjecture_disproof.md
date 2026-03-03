# EP-854 historical sub-conjecture: explicit disproof

## Claim (historical, stronger than current EP-854 statement)
For primorial modulus `n_k`, every even `t <= max_i(a_{i+1}-a_i)` occurs as a
consecutive reduced-residue gap `a_{j+1}-a_j`.

## Counterexample at `k=6`
Take
`n_6 = 2*3*5*7*11*13 = 30030`,
and let
`1=a_1<a_2<...<a_{phi(n_6)}=n_6-1`
be integers coprime to `n_6`.

Exact computation gives:
- `phi(n_6)=5760`;
- maximum consecutive gap is `22`;
- even gap values present up to `22` are
  `{2,4,6,8,10,12,14,16,18,22}`;
- `20` is missing.

Hence not all even values up to the maximum gap occur.
So the historical "all-even-up-to-max" conjecture is false.

## Reproducible certificate
Script:
- `scripts/ep854_k6_dual_check.mjs`

Output:
- `data/ep854_k6_dual_check.json`

The script verifies the same conclusion by two independent constructions:
1. direct `gcd(a,30030)=1` enumeration;
2. sieve-style marking by prime factors `2,3,5,7,11,13`.
