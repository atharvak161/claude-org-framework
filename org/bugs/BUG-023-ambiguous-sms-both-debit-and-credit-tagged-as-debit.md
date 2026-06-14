# BUG-023 — Ambiguous SMS Matching Both Debit and Credit Keywords Tagged as Debit
**Severity:** Medium
**File:** /Users/atharva/Downloads/organisation/src/projects/financial-dashboard/js/pages/transactions.js (lines 45–47, 89)
**Symptom:** A refund or reversal SMS that contains both debit and credit keywords (e.g. "Rs 500 debited… refund credited") is imported as a debit transaction, inflating the user's total debits and double-counting the spend.
**Root cause:** The code correctly skips messages where neither `isDebit` nor `isCredit` is true (line 47), but has no branch for the case where BOTH are true. The row is pushed with `isDebit: true` (line 89) because `isDebit` was set first. Refund SMS messages commonly contain both "debited" (original transaction reference) and "credited" (refund confirmation) in the same message body.
**Reproduction:** Paste the SMS: "Rs.500.00 debited from A/c XX1234 on 12-Jun. Refund of Rs.500.00 credited to your account." → parsed as a Debit of ₹500 (refund is missed or double-counted).
**Fix hint:** After computing `isDebit` and `isCredit`, add an explicit ambiguity handler — either `continue` to skip the message and surface it as unparseable, or apply a precedence rule (e.g. credit wins when both match, since refunds are more commonly the "new" information).
