# EP-878 partial attempt

## Route
Audited statement integrity and compared with background claims.

## Data quality issue
The dataset entry is split/truncated across `statement` and `background` fields (`"(a_i,a_j)=1 for i"` continues as `"eq j"` in background), so the problem text is malformed as stored.

## What is still usable from background
- Partial progress claims are present (for example, `max_{n<=x} f(n)` asymptotics along a sequence of `x`).
- Multiple stronger/global variants remain open in the supplied text.

## Status
Treat as statement-malformed dataset record with partial known results embedded in background.
