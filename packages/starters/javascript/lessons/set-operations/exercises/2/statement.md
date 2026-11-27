Write `checkAccess(required, granted)`. Both are arrays of permission names.

Return `"full"` when every required permission is granted, `"none"` when no required permission is granted, and `"partial"` otherwise. Nothing required means full access.

Example 1: checkAccess(["read", "write"], ["read", "write", "admin"])  ->  "full"
Example 2: checkAccess(["read", "write"], ["write"])  ->  "partial"
Example 3: checkAccess(["read"], [])  ->  "none"
Example 4: checkAccess([], [])  ->  "full"
