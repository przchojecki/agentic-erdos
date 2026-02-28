# EP-734 partial resolution

## Statement
Construct large pairwise balanced designs where each block size `t` occurs only
`O(n^{1/2})` times.

## What is resolved
Background cites de Bruijn--Erdos: any pairwise balanced design has at least `n`
blocks, implying some size class must occur at least on the order of `n^{1/2}`.
So `n^{1/2}` is a necessary scale for the maximum multiplicity of a size.

## What remains open in this note
The requested construction achieving `O(n^{1/2})` uniformly for every block size
is not provided in the cited record.

## Status
- necessary scale (`>=` constant times `n^{1/2}` for some size): known.
- matching global construction: unresolved.
