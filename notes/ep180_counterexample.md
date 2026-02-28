# EP-180: counterexample as written

## Statement (as written)
For every finite family of graphs `F`, does there exist `G in F` such that

`ex(n;G) <<_F ex(n;F)`?

## Explicit finite counterexample
Take

`F = { K_{1,2}, 2K_2 }`,

where:
- `K_{1,2}` is the 2-edge star,
- `2K_2` is a matching of size 2 (two disjoint edges).

### Step 1: `ex(n;F)` is constant
A graph avoiding `K_{1,2}` has maximum degree at most `1`, so it is a matching.
A graph avoiding `2K_2` has matching number at most `1`.
Combining both, any `F`-free graph has at most one edge.

Hence for all `n >= 2`:

`ex(n;F) = 1`.

### Step 2: each single-graph extremal number is linear
- For `K_{1,2}`:
  forbidding `K_{1,2}` means maximum degree at most `1`, so maximum edges is a maximum matching:
  `ex(n;K_{1,2}) = floor(n/2) = Theta(n)`.

- For `2K_2`:
  forbidding `2K_2` means every two edges intersect.
  For `n >= 4`, the largest intersecting family of 2-subsets has size `n-1` (a star), so
  `ex(n;2K_2)=n-1 = Theta(n)`.

Thus every `G in F` has `ex(n;G)=Theta(n)`, while `ex(n;F)=1`.

Therefore no `G in F` can satisfy

`ex(n;G) <= C_F * ex(n;F)` for all large `n`.

So the EP-180 statement is false as written.

