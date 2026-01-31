# Scoreboard for streaming protocol — verify ordering, duplication & loss

Design a scoreboard that compares observed outputs with expected reference model results and flags ordering, duplication or loss.

## Pseudo

```pseudo
expected_q.push(expected_transaction);
when observed_transaction arrives:
  if expected_q.empty() -> report unexpected
  else if observed != expected_q.peek() -> report ordering/duplication/loss
  else expected_q.pop();
```
