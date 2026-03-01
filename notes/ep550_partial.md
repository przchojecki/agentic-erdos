# EP-550 partial

## Statement
For tree `T` on `n` vertices and complete multipartite `G` with class sizes
`m_1<=...<=m_k`, prove
`R(T,G) <= (chi(G)-1)(R(T,K_{m_1,m_2})-1)+m_1` for large `n`.

## Attempt in this batch
I focused on structural reduction checks and base/special cases.

## Result
- For `k=2` (so `G=K_{m_1,m_2}`), the inequality is immediate:
  `R(T,K_{m_1,m_2}) <= 1*(R(T,K_{m_1,m_2})-1)+m_1`.
- Background gives exact tree-vs-clique values (`R(T,K_m)` by Chvatal), but this
  does not directly settle the multipartite inequality.

## Hard point
The unresolved step is a genuine multipartite Ramsey transfer from the
`K_{m_1,m_2}` case to arbitrary `k`-partite `G`.

