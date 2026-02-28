# EP-369 full solution (as written)

## Statement
For fixed `epsilon>0` and `k>=2`, ask whether for all sufficiently large `n`
there is a block of `k` consecutive integers in `{1,...,n}` all of which are
`n^epsilon`-smooth.

## Claim
The statement is true as written.

## Proof
Take the fixed consecutive block

`1,2,...,k`.

If `n > k^(1/epsilon)`, then `n^epsilon > k`.
For each `m in {1,...,k}`, every prime factor of `m` is at most `m<=k<n^epsilon`.
Hence each such `m` is `n^epsilon`-smooth.
Therefore, for all sufficiently large `n` (namely `n > k^(1/epsilon)`), the
block `{1,...,k}` is a sequence of `k` consecutive integers in `{1,...,n}` that
are all `n^epsilon`-smooth.

So the problem, as written, is proved.

## Note
The background indicates nontrivial corrected variants (e.g. requiring
`m^epsilon`-smoothness for each term, or requiring the block near `n`).
