# SVA Fundamentals — 'a implies b' (spot protocol violations)

Scenario: You're verifying a simple handshake: when `req` is asserted, `ack` must follow. Explain what an assertion does and how it helps catch protocol violations in simulation and formal.

![handshake diagram](./images/handshake.svg)

## Description

Explain immediate vs concurrent assertions briefly and provide a tiny example.

## Example

```systemverilog
assert property (a |-> b);
```

## Hints

- Review implication operators.
- Use `disable iff` for resets.
