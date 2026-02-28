# EP-394 partial resolution

## Statement split
1. Is `sum_{n<=x} t_2(n) << x^2/(log x)^c` for some `c>0`?
2. For `k>=2`, is `sum_{n<=x} t_{k+1}(n) = o(sum_{n<=x} t_k(n))`?

## What is resolved
Background says an earlier Erdos conjecture `sum_{n<=x} t_2(n)=o(x^2)` was proved
by Erdos--Hall, with the explicit bound

`sum_{n<=x} t_2(n) << x^2 * (log log log x)/(log log x)`.

Hence the coarse `o(x^2)` behavior is settled.

## What remains open in this note
The stronger log-power improvement in subquestion (1) is not obtained by this
bound, and subquestion (2) is also not resolved by the provided background.

## Status
- coarse `o(x^2)` for `sum t_2(n)`: resolved.
- stronger log-power / higher-k comparison claims: unresolved.
