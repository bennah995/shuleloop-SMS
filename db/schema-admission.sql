
ALTER TABLE students ADD COLUMN admission_number INTEGER UNIQUE;
ALTER TABLE schools ADD COLUMN next_admission_number INTEGER NOT NULL DEFAULT 1;