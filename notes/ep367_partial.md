# EP-367 partial resolution

## Statement split
With `B_2(n)` the squareful part of `n`, ask for fixed `k>=1`:
1. Is
   `prod_{n <= m < n+k} B_2(m) << n^{2+o(1)}`?
2. Perhaps even the stronger bound
   `prod_{n <= m < n+k} B_2(m) <<_k n^2`?

## What is resolved
The background records van Doorn's observation:
- for `k<=2`, `<< n^2` is trivial;
- for every `k>=3`, the `<<_k n^2` claim fails;
- in fact for `k=3`,
  `prod_{n <= m < n+3} B_2(m) >> n^2 log n`
  infinitely often.

Since `n^2 log n` is unbounded relative to `n^2`, the stronger `<<_k n^2`
question is false (already at `k=3`).

## What remains open
This does not refute the weaker `n^{2+o(1)}` statement, because
`n^2 log n = n^{2+o(1)}`.
So the first question remains open in this note.

## Status
- Stronger `<<_k n^2` version: false.
- Weaker `n^{2+o(1)}` version: unresolved.
