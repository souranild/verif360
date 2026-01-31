# Immediate vs Concurrent SVA

Describe the difference between immediate and concurrent assertions and give a small example for each.

## Example

Immediate:
```systemverilog
assert (cond) else $error("Failed");
```

Concurrent:
```systemverilog
assert property (@(posedge clk) a |-> b);
```
