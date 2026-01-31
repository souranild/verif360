# Chasing a Heisenbug — isolate an intermittent race in testbench/DUT

Describe a systematic approach to reproduce, isolate, and fix the race. Include debug instrumentation, deterministic reproduction strategies, and how to use waveforms/sanity checks.

## Steps

1. Save random seed and waveform snippet.
2. Add scoped logs / assertions to localize.
3. Reduce to minimal reproducer.
4. Fix with handshake qualifiers or scheduling changes.
