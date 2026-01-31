# Weighted Coverage — detect rare corner-cases and prioritize tests

Design coverpoints and weight bins so rare events are visible and prioritized. Explain how you'd schedule tests to focus on low-coverage, high-risk bins.

## Example

```systemverilog
covergroup cg @(posedge clk);
  type_cp: coverpoint pkt.type { bins normal = {0}; bins rare_error = {1}; bins corruption = {2}; option.weight = 10; }
endgroup
```
