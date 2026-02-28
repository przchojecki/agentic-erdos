# EP-422 deep attempt with computation

## Statement
For Hofstadter's recursion
`f(1)=f(2)=1`, `f(n)=f(n-f(n-1))+f(n-f(n-2))`,
ask if infinitely many integers are missed and determine behavior.

## What is resolved
Background notes a fundamental open issue: global well-definedness for all `n` is
unknown.

A local computation in this workspace verified well-definedness through
`n=500000`, with `max f(n)=270736` on that range.

## Additional finite evidence
On the same range, many integers up to `max f(n)` are absent (for example
`7,13,15,18,27,...`).

## What remains open in this note
Finite computation does not settle global well-definedness or infinitude of
missed values.

## Status
- large finite-prefix evidence: present.
- global questions: unresolved.
