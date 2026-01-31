# Formal vs Simulation — prove mutual exclusion for grants

Explain when you'd use formal vs more simulation, and write an SVA property that asserts mutual exclusion for `grant1` and `grant2`.

## Example

```systemverilog
property p_mutual_excl; @(posedge clk) !(grant1 && grant2); endproperty
assert property (p_mutual_excl) else $error("Mutual exclusion violated");
```
