# Covergroup Detective — find missing packet type×length combos

Capture what your tests miss: write a covergroup that samples `packet.type` and `packet.len`, cross them, and explain how you'd use the resulting report to hunt down coverage holes.

```systemverilog
covergroup pkt_cg @(posedge clk);
  type_cp: coverpoint pkt.type { bins r = {0}; bins w = {1}; }
  len_cp: coverpoint pkt.len;
  cross_cp: cross type_cp, len_cp;
endgroup
```
