# Kubernetes Upgrade Modeling (TLA+)

A formal specification of Kubernetes application upgrades using TLA+ (Temporal Logic of Actions). This model explores concurrent Helm upgrades with parallelism constraints, success/failure tracking, and state management.

## Files

- `UpgradeModeling.tla` - TLA+ specification module

## Model Overview

The model defines:
- **Constants**: `Apps` (set of applications to upgrade), `MaxParallel` (concurrency limit)
- **States**: `NotStarted`, `Upgrading`, `Upgraded`, `Failed`
- **Variables**: `status`, `active`, `completed`, `failed`
- **Invariants**: Type safety, no state overlap, partitioning, capacity constraints

## Properties Modeled

- At most `MaxParallel` upgrades can run concurrently
- Each app progresses through states with proper transitions
- Apps end in either `Upgraded` or `Failed` state
- All apps reach terminal states (completed or failed)

## Running/Model Checking

Use the TLA+ Toolbox or TLC model checker:

```bash
tlc UpgradeModeling.tla
```

Or use the PlusCal translator if modifying the algorithm.

## Related Documentation

See the PlusCal algorithm section in the file for a procedural view of the upgrade logic.
