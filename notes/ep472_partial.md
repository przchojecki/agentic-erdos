# EP-472 deep attempt with computation

## Statement
Starting from a finite prime seed `q_1<...<q_m`, define
`q_{n+1}` as the smallest prime of the form `q_n+q_i-1`. Does some seed produce
an infinite sequence?

## Attempt route
Tested growth behavior for standard seed examples and looked for termination
mechanisms from modular obstructions.

## Computation signal
For seed `(3,5)`, generation continued for at least 400 terms in this workspace
(with no termination), ending near 4073 on that finite run.

## Obstacle
Long finite runs do not prove infinitude.

## Status
- positive finite-prefix evidence: present.
- infinitude theorem: unresolved.
