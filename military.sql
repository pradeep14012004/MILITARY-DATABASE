-- Create the database
CREATE DATABASE MILITARY;
USE MILITARY;



CREATE TABLE units (
    unit_id INT PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    commander_id INT DEFAULT NULL
);

SELECT *FROM units;


CREATE TABLE soldiers (
    serviceid INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('M', 'F', 'O') DEFAULT NULL,
    `rank` VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    unit_id INT NOT NULL,
    enlistment_date DATE NOT NULL,
    discharge_date DATE DEFAULT NULL,
    status ENUM('Active', 'Inactive', 'Retired') DEFAULT 'Active',
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') DEFAULT NULL,
    last_known_location VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE soldiers DROP FOREIGN KEY soldiers_ibfk_1;
ALTER TABLE soldiers
ADD CONSTRAINT fk_soldiers_unit
FOREIGN KEY (unit_id)
REFERENCES units(unit_id)
ON DELETE CASCADE
ON UPDATE CASCADE;
describe soldiers;
SELECT *FROM soldiers;

-- 3. Equipment table

CREATE TABLE equipment (
    equipment_id INT PRIMARY KEY auto_increment,
    type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active'
);

SELECT *FROM equipment;

CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    equipment_id INT NOT NULL,
    date_assigned DATE NOT NULL,
    date_returned DATE DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (date_returned IS NULL OR date_returned >= date_assigned)
);
SELECT *FROM assignments;


CREATE TABLE missions (
    mission_id INT PRIMARY KEY AUTO_INCREMENT,
    mission_name VARCHAR(100) NOT NULL,
    objective TEXT DEFAULT NULL,
    status ENUM('Planned', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Planned',
    serviceid INT NOT NULL,
    assignment_id INT NOT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

select * FROM missions;


DROP TABLE IF EXISTS training_courses;
CREATE TABLE training_courses (
    course_id INT PRIMARY KEY auto_increment,
    course_name VARCHAR(100) NOT NULL,
    serviceid INT NOT NULL,
    duration_days INT NOT NULL,
    instructor_id INT NOT NULL,
    institute VARCHAR(255) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES soldiers(serviceid),
    FOREIGN KEY (`serviceid`) REFERENCES `soldiers` (`serviceid`)
ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT *FROM training_courses;


DROP TABLE IF EXISTS med_table;
CREATE TABLE medical_records (
    record_id INT PRIMARY KEY auto_increment,
    serviceid INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') DEFAULT NULL,
    allergies TEXT DEFAULT NULL,
    vaccination_status VARCHAR(50) DEFAULT NULL,
    date_recorded DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);
SELECT *FROM medical_records;


CREATE TABLE dependents (
    dependent_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(20) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);
SELECT *FROM dependents;


CREATE TABLE payroll (
    payroll_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    month DATE NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) GENERATED ALWAYS AS (base_salary + allowances) STORED,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE payroll MODIFY month VARCHAR(7);
SELECT *FROM payroll;

SHOW TABLES;

WHERE soldiers.serviceid = 1;


-- Done
