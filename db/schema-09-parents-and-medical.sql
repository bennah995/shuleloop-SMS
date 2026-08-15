-- schema-09-parents-and-medical.sql
-- Adds parent/guardian records (1-2 per student) and an optional medical
-- conditions field on students.
--
-- Apply by hand, local first, then Neon (same pattern as every prior
-- schema-*.sql file in this project — no migration tool in use yet).
--   psql -U shuleloop_app -d shuleloop_dev -f schema-09-parents-and-medical.sql
--   psql "<neon-connection-string>" -f schema-09-parents-and-medical.sql

ALTER TABLE students
  ADD COLUMN medical_conditions TEXT;

CREATE TABLE parents (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  national_id VARCHAR(20),
  relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('mother', 'father', 'guardian', 'other')),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Not adding school_id here deliberately — parents are always reached via
-- student_id, same pattern as attendance/grades/student_subjects, all of
-- which scope through their student_id -> students.school_id relationship
-- rather than duplicating school_id onto every child table.

-- Optional but recommended: speeds up "give me this student's parents" lookups.
CREATE INDEX idx_parents_student_id ON parents(student_id);