-- -----------------------------------------------------
-- Table courseregistry
-- -----------------------------------------------------
DROP TABLE IF EXISTS courseregistry;

CREATE TABLE IF NOT EXISTS courseregistry (
  ClassCode CHAR(8),
  CreditHours INT NOT NULL,
  Description TEXT NOT NULL,
  Name VARCHAR(200) NOT NULL,
  PreRecs TEXT NULL,
  CountsFor VARCHAR(45) NULL,
  Core INT NOT NULL,
  Foundational INT NOT NULL,
  ComputerScience INT NOT NULL
);

-- -----------------------------------------------------
-- Table degreerequirements
-- -----------------------------------------------------
DROP TABLE IF EXISTS degreerequirements;

CREATE TABLE IF NOT EXISTS degreerequirements (
  MajorCode SERIAL PRIMARY KEY,
  TotalCredits INT NOT NULL,
  Requirements TEXT NOT NULL
);

-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  userId SERIAL PRIMARY KEY,
  username VARCHAR(200),
  email VARCHAR(200),
  password BYTEA,
  degree VARCHAR(45),
  major VARCHAR(45),
  majorCode INT
);
