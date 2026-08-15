-- schema-10-names-and-documents.sql
-- Run AFTER schema-09-parents-and-medical.sql.
--   psql -U shuleloop_app -d shuleloop_dev -f schema-10-names-and-documents.sql
--   psql "<neon-connection-string>" -f schema-10-names-and-documents.sql

-- --- parents: split single `name` into first/middle/last ---
ALTER TABLE parents
  ADD COLUMN first_name VARCHAR(100),
  ADD COLUMN middle_name VARCHAR(100),
  ADD COLUMN last_name VARCHAR(100);

-- If you've already created test parent rows via the old single `name`
-- column, backfill before dropping it, e.g.:
--   UPDATE parents SET first_name = split_part(name, ' ', 1),
--                       last_name  = split_part(name, ' ', 2)
--   WHERE first_name IS NULL;
-- If the table is still empty (most likely, since schema-09 is brand new),
-- skip straight to the DROP below.

ALTER TABLE parents DROP COLUMN name;
ALTER TABLE parents ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE parents ALTER COLUMN last_name SET NOT NULL;

-- --- students: add name parts + admission documents ---
-- `students.name` is intentionally left untouched — it stays the single
-- source of truth every existing grading/ranking/report-card/dashboard
-- query already reads. The API computes `name` from first/middle/last on
-- insert, so nothing downstream needs to change. first/middle/last here are
-- purely additive (admission records, future surname-sort, etc).
ALTER TABLE students
  ADD COLUMN first_name VARCHAR(100),
  ADD COLUMN middle_name VARCHAR(100),
  ADD COLUMN last_name VARCHAR(100),
  ADD COLUMN passport_photo_url TEXT,
  ADD COLUMN kcpe_certificate_url TEXT,
  ADD COLUMN leaving_certificate_url TEXT;