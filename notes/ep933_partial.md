# EP-933 partial

## Statement
If `n(n+1)=2^k 3^l m` with `(m,6)=1`, is
`limsup_{n->infty} (2^k 3^l)/(n log n) = infty`?

## Attempt in this batch
I scanned `n` up to `2e7`, computing exact `v_2` and `v_3` of `n(n+1)` and the
normalized ratio.

Data file:
- `data/ep933_smoothpart_scan.json`

## Result
- Global maximum in scan is at tiny `n` (`n=2`, ratio about `4.328`).
- For `n>=1000`, best observed ratio is about `3.642` (`n=6560`).
- For `n>=10000`, best observed ratio is about `3.627` (`n=14336`).
- Explicit family `n=2^(3^r)` gives constant ratio `3/log 2 ~= 4.328`, not growth.

## Hard point
No increasing trend toward infinity appears in this large finite scan.
That is strong negative evidence, but not a proof that limsup is finite.

