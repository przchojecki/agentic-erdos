# EP-985 partial attempt

## Route
Exact computational check for primes `p<=30,000,000`: searched prime `q<p`
that is a primitive root mod `p`.

## Evidence from this batch
- `scripts/ep985_prime_primitive_root_scan.mjs`
- `data/ep985_prime_primitive_root_scan.json`: no failures among `1,857,857`
  tested primes (`p<=30,000,000`).

## Hard point
A finite verification window does not imply the statement for all primes.

## Status
No counterexample found in range; global statement remains open.

## Additional computational extension (2026-03-03)
I expanded the exact prime scan multiple times:
- `p<=50,000,000`: checked `3,001,132` primes, failures `0`.
- `p<=100,000,000`: checked `5,761,453` primes, failures `0`.
- `p<=200,000,000`: checked `11,078,935` primes, failures `0`.

So there is still no finite counterexample signal in a very large range.
