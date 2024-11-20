-- -----------------------------------------------------
-- Table `courseregistry`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `courseregistry` ;

CREATE TABLE IF NOT EXISTS `courseregistry` (
  `ClassCode` INT NOT NULL AUTO_INCREMENT,
  `Department` CHAR(4) NOT NULL,
  `CreditHours` INT NOT NULL,
  `Description` MEDIUMTEXT NOT NULL,
  `Name` VARCHAR(200) NOT NULL,
  `PreRecs` MEDIUMTEXT NULL,
  `CountsFor` VARCHAR(45) NULL,
  `Core` INT NOT NULL,
  `Foundational` INT NOT NULL,
  `ComputerScience` INT NOT NULL,
  PRIMARY KEY (`ClassCode`, `Department`));


-- -----------------------------------------------------
-- Table `degreerequirements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `degreerequirements` ;

CREATE TABLE IF NOT EXISTS `degreerequirements` (
  `MajorCode` INT NOT NULL AUTO_INCREMENT,
  `TotalCredits` INT NOT NULL,
  `Rerquirements` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`MajorCode`));


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

CREATE TABLE IF NOT EXISTS `user` (
  `UserId` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(200) NOT NULL,
  `Email` VARCHAR(200) NOT NULL,
  `Password` BINARY(64) NOT NULL,
  `Degree` VARCHAR(45) NOT NULL,
  `Major` VARCHAR(45) NOT NULL,
  `MajorCode` INT NOT NULL,
  PRIMARY KEY (`UserId`));

=======
CREATE TABLE IF NOT EXISTS users 
(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL,
    degree VARCHAR(50) NOT NULL,
);
