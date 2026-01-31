# Write a UVM sequence and sequence_item for a packet (addr,data,len)

Design a UVM packet generator that randomly (but sensibly) throws packets at the DUT — `addr`, `data`, `len` — while avoiding illegal addresses. Show the sequence_item and a sequence that issues randomized packets to a sequencer.

## Example

```systemverilog
class pkt extends uvm_sequence_item; rand bit [31:0] data; rand bit [7:0] addr; rand bit [3:0] len; constraint legal_addr { addr inside {[8'h10:8'hEF]}; } endclass
```
