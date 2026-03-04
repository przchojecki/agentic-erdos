# EP-155 partial

## Evidence from this batch
Computed an exact finite profile for `F(N)` (max Sidon size in `[1..N]`) up to
`N=72`:
- script: `scripts/ep155_increment_profile_exact_to72.mjs`
- data: `data/ep155_increment_profile_exact_to72.json`

This uses exact previously computed values through `N=60` and exact backtracking
extension for `N=61..72`.

## Finite increment profile
From the exact summary:
- `F(N+1)-F(N)` has min/max `0/1` (no counterexample to the `k=1` form in range).
- For `k=2,3`, also min/max `0/1` in range.
- For larger shifts: `k=4,5,6,8` reach max increment `2`, and `k=10` reaches `3`.

So finite data through `N=72` is consistent with the conjectured eventual
`F(N+k) <= F(N)+1` for small fixed `k`, but is far from a proof.

## Status
Open; exact finite evidence added.

## Step 1 extension (2026-03-04)

Extended exact finite profile from `N<=72` to `N<=76`:
- script: `scripts/ep155_increment_profile_exact_to72.mjs` with `N_EXT=76`
- updated data: `data/ep155_increment_profile_exact_to72.json`

Update:
- `F(74)=11`, `F(75)=11`, `F(76)=11`.
- For shifts `k=1,2,3`, increments `F(N+k)-F(N)` in tested range still remain in `{0,1}`.

So the finite evidence for small-shift `+1` behavior remains intact on the extended exact range.
