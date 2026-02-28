# EP-706 deep attempt (baseline known)

## Statement
L(r): maximum possible chromatic number for planar distance graphs built from a
point set P and r allowed distances. Estimate L(r), especially whether L(r)<=r^{O(1)}.

## Attempt route
Tried decomposition heuristics by distance layers and graph-product style bounds to
force polynomial growth in r.

## Obstacle
Even the one-distance case r=1 (Hadwiger-Nelson) is only bounded between 5 and 7,
so current methods do not establish polynomial dependence in general r.

## Status
- baseline r=1 finite bounds known.
- polynomial-in-r bound unresolved in this attempt.
