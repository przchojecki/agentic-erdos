# EP-501 partial attempt

## Route
Separated the two subquestions and made the second one explicit as a proved
implication from the closed-case theorem in the background.

## Fully resolved subquestion
Second subquestion:

> If all `A_x` are closed with measure `<1`, must there exist an independent set
> of size `3`?

Background gives a stronger theorem (Newelski-Pawlikowski-Seredyński, 1987):
under the closed-case assumptions there exists an **infinite** independent set.
Hence an independent set of size `3` exists immediately.

## What remains open here
First subquestion (unrestricted bounded outer-measure mapping) is not closed by
the listed facts:
- CH model: negative result (Hechler).
- Closed-case strengthening: positive result (NPS87).
So the unrestricted ZFC status is unresolved in this batch.

## Why a direct unconditional proof cannot work here
Let `S` denote the first subquestion statement:

`For every map x -> A_x (bounded, outer measure < 1), there is an infinite independent set.`

From Hechler (as cited in the background), under CH there is a counterexample to
`S`, i.e. `ZFC + CH + not S` is consistent (relative to the reference claim).

Therefore, assuming `ZFC` is consistent, `ZFC` cannot prove `S`; otherwise `S`
would hold in every model of `ZFC`, contradicting a model of `ZFC + CH + not S`.

So a full unconditional proof of the first subquestion is blocked by the
set-theoretic counterexample framework in the cited literature.

## Status
Second subquestion solved; first subquestion remains open/set-theoretically
delicate.
