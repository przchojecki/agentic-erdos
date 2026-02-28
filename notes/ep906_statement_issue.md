# EP-906 statement issue: trivially true as written

## Statement
Does there exist a nonzero entire function `f` such that for every infinite increasing
sequence `n_1<n_2<...`, the set

`{ z : f^{(n_k)}(z)=0 for some k }`

is dense in `C`?

## Direct resolution as written
Take `f(z)=1` (a nonzero entire function).
For every `m>=1`, `f^{(m)}(z)=0` identically.
Hence for any infinite sequence `n_k` of positive integers,
`f^{(n_k)}(z)=0` for all `z` and all `k`.
So the set above is exactly `C`, in particular dense.

Therefore the existential statement is true in a trivial way.

## Why this is likely a wording issue
The background notes that the problem becomes nontrivial if one requires `f` to be
transcendental (or otherwise excludes polynomial/constant cases).

## Status
- As written: resolved (trivially true).
- Nontrivial intended variant (e.g. `f` transcendental): unresolved here.
