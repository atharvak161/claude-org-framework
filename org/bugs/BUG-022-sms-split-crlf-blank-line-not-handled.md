# BUG-022 — SMS Split Regex Does Not Handle Windows CRLF Blank Lines
**Severity:** Low
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/pages/transactions.js (line 35)
**Symptom:** When a user pastes multiple SMS messages separated by blank lines in Windows line-ending format (`\r\n\r\n`), all messages are treated as a single message. Zero transactions are parsed (or one malformed one), and the preview shows "No recognisable bank SMS found."
**Root cause:** The split regex is `/\n{2,}|\r\n{2,}/`. The second alternative `\r\n{2,}` means one `\r` followed by two-or-more `\n` characters — it does NOT match two consecutive `\r\n` sequences. A Windows blank line is `\r\n\r\n`, which this pattern never matches.
**Reproduction:** Copy two SMS messages from a Windows clipboard source (line endings `\r\n`) separated by a blank line, paste into the SMS textarea, click Parse. Both messages are parsed as one block and likely rejected.
**Fix hint:** Replace the split regex with `/(?:\r?\n){2,}/` which matches two or more newlines regardless of whether they are LF or CRLF.
