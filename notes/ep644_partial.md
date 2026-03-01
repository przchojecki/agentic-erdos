# EP-644 partial attempt

## Route
Recast the condition as a 2-hitting local property on `r`-tuples and compared against the known exact values for `r=3,4,5,6`.

## What is resolved from background
Exact values are known for small `r`:
- `f(k,3)=2k`
- `f(k,4)=\lfloor 3k/2 \rfloor`
- `f(k,5)=\lfloor 5k/4 \rfloor`
- `f(k,6)=k`

## Hard point
General asymptotic linearity `f(k,r)=(1+o(1))c_r k` for `r>=7` requires new global structure beyond current local-transversal counting.

## Status
Small-`r` cases settled; general `r>=7` asymptotic constants remain open.
