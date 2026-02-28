# EP-468 statement issue

## Issue
The dataset statement is corrupted (contains an injected fragment like
`", "difficulty": "L1" },{`) and the background field is empty.

## Consequence
The record cannot be analyzed reliably until the intended statement text is
recovered from a clean source.

## Status
- malformed dataset entry.
