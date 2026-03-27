# Shared Environment Migration Rules

## Purpose
Defines stricter migration behavior for shared SmartPRO environments such as CI databases, shared development databases, staging, or any persistent team-used environment.

## Rules
1. applied migration files are immutable
2. checksum mismatch is a stop condition
3. manual edits to migration history are prohibited
4. schema fixes require new migration files
5. migration failures must be investigated before rerun
6. reset-based recovery is not acceptable unless the environment is explicitly disposable

## Local vs Shared Difference

### Local Disposable Environment
- reset may be acceptable
- recovery may involve recreating schema from scratch

### Shared Environment
- preserve history
- restore integrity from source control
- use corrective migrations
- document and communicate failures

## Examples of Shared Environments
- CI test database
- shared team development database
- staging
- any long-lived integration environment
