# ADR-001: No User Accounts in v1

**Date:** 2026-02-22  
**Status:** Decided  
**Decided by:** Austin

## Context
The app needs to launch with minimum friction. User accounts add complexity (auth flow, onboarding, password reset) and provide no value until there are features that require persistence (saved searches, tee time alerts).

## Decision
v1 ships with zero authentication. Users open the app and search immediately. No sign-up, no login.

## Consequences
- Tee time alerts (premium feature) must wait until v2 when accounts are added
- No personalization in v1
- Significantly faster path to launch
- Lower barrier to first-time use
