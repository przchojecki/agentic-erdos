# EP-614 statement issue

## Issue
The dataset statement is corrupted (contains an injected fragment like
`", "difficulty": "L1" },{`) and background is empty.

## Consequence
This row cannot be analyzed reliably without restoring the intended statement.

## Status
- malformed dataset entry.
