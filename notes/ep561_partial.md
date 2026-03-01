# EP-561 partial

## Statement
For unions of stars
`F_1 = union_{i<=s} K_{1,n_i}` and `F_2 = union_{j<=t} K_{1,m_j}`,
determine the size Ramsey number `hat R(F_1,F_2)`.

## Attempt in this batch
I focused on the single-star base case (`s=t=1`) and exact tiny checks.

Data files:
- `data/ep561_star_size_ramsey_small_exact.json`
- `data/ep561_star44_lowercheck.json`

## Result
- Exhaustive exact checks confirm
  `hat R(K_{1,a},K_{1,b}) = a+b-1` for `(a,b)=(2,2),(2,3),(3,3),(3,4)`.
- For `(a,b)=(4,4)`, exhaustive lower check shows no Ramsey host with `m<=6`,
  and `K_{1,7}` gives an upper bound `m<=7`, hence exact value `7`.

## Hard point
These are base-case validations (`s=t=1`) and do not settle the full union-of-stars
formula for arbitrary `s,t`.

