-- Subjects catalog (fixed 9-subject KCSE structure)
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(30) NOT NULL CHECK (category IN ('compulsory', 'optional_compulsory', 'humanities', 'technical'))
);

-- Which subjects each student is registered for
CREATE TABLE student_subjects (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  UNIQUE(student_id, subject_id)
);

-- Rebuild grades table: subject_id (FK) instead of free-text subject
DROP TABLE IF EXISTS grades;
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  term VARCHAR(50) NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject_id, term)
);

-- Teacher and principal comments per student per term
CREATE TABLE report_comments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  term VARCHAR(50) NOT NULL,
  teacher_comment TEXT,
  principal_comment TEXT,
  UNIQUE(student_id, term)
);