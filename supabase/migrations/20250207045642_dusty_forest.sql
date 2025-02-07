CREATE TABLE IF NOT EXISTS readings (
  id TEXT PRIMARY KEY,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  pulse INTEGER,
  timestamp TEXT NOT NULL
);