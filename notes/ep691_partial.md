# EP-691 partial attempt

## Route
Tested block-sequence models
`A = union_k (n_k, (1+eta_k)n_k]`
with `eta_k = k^{-beta}` for several growth ratios `n_{k+1}/n_k`.

## Evidence from this batch
- `data/ep691_block_behrend_density_scan.json` (`x=500000`) gives coverage densities of `M_A` between about `0.68` and `0.90` across tested `(ratio,beta)` choices.

## What is resolved from background
- For block sequences with two-sided lacunarity control, a sharp threshold theorem is known (Tenenbaum).

## Hard point
The full problem asks for necessary and sufficient conditions for arbitrary sets `A`; finite block models are only a narrow subclass.

## Status
Partial subclass behavior explored; general characterization remains open.
