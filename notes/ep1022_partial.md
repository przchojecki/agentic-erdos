# EP-1022 deeper attempt

## Statement
Find `c_t` (with `c_t->infinity`) such that local subset-density condition
`# {A in F: A subset X} < c_t |X|` for all `X` forces property B.

## Computation in this attempt (finite search, t=3)
I ran random search over non-property-B 3-uniform families on 9 vertices and measured
`rho=max_X e(X)/|X|`.

Data file:
- `data/ep1022_random_nonpropertyB_density_search.json`

Best found non-property-B family had `rho ~ 1.222`.

## Interpretation
This is finite lower-bound evidence on thresholds for small instances, not an
asymptotic determination of `c_t`.
