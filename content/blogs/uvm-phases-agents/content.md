# UVM Phases & Agents — Building Reusable Testbenches

UVM phasing and component architecture are core to creating scalable testbenches. This post outlines phases (build, connect, run, extract) and the role of agents, drivers, monitors, and scoreboards.

## Anatomy of an Agent
- **Driver**: converts transactions to pin-level signals.
- **Monitor**: observes signals and creates transactions (TLM).
- **Sequencer/Sequence**: drives driver with sequence_items.
- **Scoreboard**: compares DUT output with reference model.

## Learning resources
- UVMkit: https://www.uvmkit.com/
- go2uvm / community projects: https://github.com/go2uvm

*References: UVMkit, go2uvm*