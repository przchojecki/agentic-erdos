# EP-596 partial resolution

## Statement
Characterize graph pairs `(G1,G2)` with the finite-color forcing property but no
infinite-color analogue in `G1`-free graphs.

## What is resolved
Background gives an explicit pair with this behavior:
`G1=C4`, `G2=C6`.

It also records that an original conjecture of nonexistence is therefore false.

## What remains open in this note
A full characterization of all such pairs is not provided in this entry.

## Status
- nonexistence conjecture: false.
- complete classification: unresolved.

## Counterexample-hunt note (2026-03-03)
I attempted to set up a computational hunt, but the core quantifiers are
infinitary:
- "for every finite number of colors there exists H ...",
- and a separate `aleph_0`-coloring condition over all `G1`-free graphs.

Finite exhaustive/random graph checks can only provide weak lower-bound signals
for small finite analogues and cannot resolve or decisively refute the actual
statement. No decisive computational counterexample test is available in this
framework.
