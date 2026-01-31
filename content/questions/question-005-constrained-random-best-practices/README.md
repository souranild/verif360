# Constrained-random: generate legal packets quickly (avoid solver nightmares)

Write constraints that prevent illegal packets (e.g., bad addrs, zero data) and explain techniques to keep randomization fast and reliable.

## Example

```systemverilog
class pkt; rand bit [7:0] addr; rand bit [31:0] data;
  constraint legal_addr { addr inside {[8'h10:8'hEF]}; }
  constraint not_zero_data { data != 32'h0; }
endclass
```
