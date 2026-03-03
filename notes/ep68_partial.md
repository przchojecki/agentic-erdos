# EP-68 partial attempt

## Route
Assessed known structure and possible irrationality proof routes against the
specific denominator pattern `n!-1`.

Added a rigorous finite denominator-exclusion computation:
- exact partial sum `S_N = sum_{n=2}^{22} 1/(n!-1) = A/B`;
- rigorous tail bound `0 < S - S_N < 6/23!`;
- checked whether any rational `p/q` with `q<=5,000,000` can lie in that interval.

Script / data:
- `scripts/ep68_rational_denominator_exclusion.mjs`
- `data/ep68_rational_denominator_exclusion.json`

Result:
- no candidate rational with denominator `q<=5,000,000` fits the rigorous
  interval.

## Hard point
Classical factorial-denominator irrationality tricks do not transfer directly to shifted denominators `n!-1`.

## Status
Open; no full irrationality proof or rationality counterexample found.
New finite exclusion evidence: denominator `<=5e6` is impossible.

## Additional computational extension (2026-03-03)
Strengthened the rigorous interval-exclusion parameters to:
- partial sum cutoff `N=24`,
- denominator cap `q<=5,000,000`.

Result stayed negative: no rational candidate interval witness was found.

## Additional extension (2026-03-03, remaining-7 batch)
Pushed one more denominator-exclusion run:
- partial-sum cutoff `N=26`,
- denominator cap `q<=10,000,000`.

Saved:
- `data/ep68_rational_denominator_exclusion_N26_Q1e7.json`

Result:
- still no rational candidate in the rigorous interval (`has_candidate=false`).
