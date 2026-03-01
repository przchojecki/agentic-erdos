# EP-786 deeper attempt with constructive search

## Statement
Seek very dense `A` with multiplicative-length uniqueness:
`prod a_i = prod b_j` implies equal number of factors.

## Experiment in this attempt
I implemented a random-order greedy constructor for finite `[1,N]` using exact linear
consistency of prime-exponent constraints.

Data file:
- `data/ep786_greedy_density_search.json`

Best densities found:
- `N=60`: 0.65
- `N=100`: 0.66
- `N=200`: 0.695
- `N=400`: 0.70

## Interpretation
This gives explicit finite high-density constructions but does not approach
`1-epsilon` yet, and does not resolve asymptotic existence/nonexistence.
