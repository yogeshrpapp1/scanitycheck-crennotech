# Shared Git Hooks

This directory contains scripts to automate environment syncing and ensure consistency across the development team. 

> **Note:** Git does not track the `.git/hooks/` directory. You must manually install these hooks to your local environment.

## Installation

To activate the hooks, copy them into your local Git configuration and ensure they are executable. Run these commands from the **project root**:

1. Copy all hooks from the tracked directory to your local git configuration
`cp .githooks/* .git/hooks/`

2. Grant executable permissions
`chmod +x .git/hooks/*`

## Available Hooks

### `post-merge`
**Trigger** \
Automatically runs after a successful git pull or git merge.

**Purpose** \
Prevents 'stale environment' bugs. When project dependencies change, this script detects the update, purges the old `node_modules` volume, and automatically rebuilds your frontend image to keep your environment in sync.