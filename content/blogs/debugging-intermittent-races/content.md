# Chasing Heisenbugs — Debugging Intermittent Races

Intermittent failures are hard to reproduce. This post outlines a pragmatic workflow: capture seeds, add instrumentation, use waveforms selectively, and reduce to minimal reproducer.

## Steps
1. Save seeds and sample waveforms when failures occur.
2. Increase logging with unique identifiers and assertion context.
3. Use binary-search and directed tests to shrink the problem window.
4. Consider formal or exhaustive techniques if the window is small and control logic-heavy.

## References
- Doulos debugging tips: https://lnkd.in/g8niZ2pz
- Growdv & blog references: https://www.growdv.com/

*References: Doulos, GrowDV*