# Repository Integration Test Matrix

## Audit Repository
1. createEvent inserts a row successfully
2. null optional fields are persisted correctly
3. before/after/metadata JSON persist correctly

## Cases Repository
1. getByIdInCompany returns row for matching company
2. getByIdInCompany returns null for wrong company
3. listByCompany returns only company rows
4. updateStatusInCompany updates only matching company row
5. updateStatusInCompany returns null for wrong company

## Documents Repository
1. getByIdInCompany returns row for matching company
2. getByIdInCompany returns null for wrong company
3. listByCaseInCompany returns only rows in matching case and company
4. updateStatusInCompany updates only matching company row
5. updateStatusInCompany returns null for wrong company
