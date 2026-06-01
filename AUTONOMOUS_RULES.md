# Autonomous Rules

## Core Rule

Complete exactly ONE task per run.

## Execution Rules

- Never begin a second task.
- Never work on multiple projects simultaneously.
- Never exceed 50% of available context.
- Never exceed 2000 output tokens.
- Never perform deployment actions without approval.
- Never perform destructive database operations without approval.

## If a task is too large

- Subdivide the task.
- Update BACKLOG.md.
- Complete only the first subdivision.
- Stop.

## Required Updates

After every run update:

- PROJECT_STATUS.md
- CHANGELOG.md

## Stopping Condition

After completing one task:

1. Update project files.
2. Recommend the next task.
3. Stop.
