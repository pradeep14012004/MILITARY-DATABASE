-- Create the database
DROP DATABASE MILITARY;
CREATE DATABASE MILITARY;
USE MILITARY;

DROP TABLE IF EXISTS units;

CREATE TABLE units (
    unit_id INT PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL,
    unit_type VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    commander_id INT DEFAULT NULL
);
-- Step 1: Drop foreign key in soldiers
ALTER TABLE soldiers DROP FOREIGN KEY soldiers_ibfk_1;

-- Step 2: Modify the column in units
ALTER TABLE units MODIFY unit_id INT NOT NULL;

-- Step 3: Recreate the foreign key constraint
ALTER TABLE soldiers 
ADD CONSTRAINT soldiers_ibfk_1 
FOREIGN KEY (unit_id) REFERENCES units(unit_id);



DROP TABLE IF EXISTS soldiers;

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
INSERT INTO units (unit_id, unit_name, unit_type, location, commander_id)
VALUES (1, 'Alpha Unit', 'Infantry', 'New York', NULL);
INSERT INTO soldiers (first_name, last_name, date_of_birth, gender, `rank`, branch, unit_id, enlistment_date, discharge_date, status, blood_type, last_known_location)
VALUES ('John', 'Doe', '1990-01-01', 'M', 'Captain', 'Infantry', 1, '2020-01-01', NULL, 'Active', 'O+', 'New York');
ALTER TABLE soldiers
ADD CONSTRAINT fk_soldiers_unit
FOREIGN KEY (unit_id)
REFERENCES units(unit_id)
ON DELETE CASCADE
ON UPDATE CASCADE;
describe soldiers;
SHOW CREATE TABLE soldiers;
DELETE FROM units WHERE unit_id = 1;
select * FROM soldiers;
-- 3. Equipment table
DROP TABLE IF EXISTS equipment;
CREATE TABLE equipment (
    equipment_id INT PRIMARY KEY auto_increment,
    type VARCHAR(50) NOT NULL,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active'
);

SELECT *FROM equipment;

-- 4. Assignments table
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

-- 5. Missions table
DROP TABLE IF EXISTS missions;

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
-- 6. Deployments table
CREATE TABLE deployments (
    deployment_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    mission_id INT DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Training Courses table
CREATE TABLE training_courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    instructor_id INT NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES soldiers(serviceid)
);

-- 8. Qualifications table
CREATE TABLE qualifications (
    qualification_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    course_id INT NOT NULL,
    date_completed DATE NOT NULL,
    score DECIMAL(5,2) DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES training_courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Medical Records table
CREATE TABLE medical_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') DEFAULT NULL,
    allergies TEXT DEFAULT NULL,
    vaccination_status VARCHAR(50) DEFAULT NULL,
    date_recorded DATE NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 10. Injury Reports table
CREATE TABLE injury_reports (
    injury_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('Minor', 'Moderate', 'Severe') DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 11. Promotions table
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    old_rank VARCHAR(50) NOT NULL,
    new_rank VARCHAR(50) NOT NULL,
    date_promoted DATE NOT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 12. Transfers table
CREATE TABLE transfers (
    transfer_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    from_unit_id INT NOT NULL,
    to_unit_id INT NOT NULL,
    date_transferred DATE NOT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (from_unit_id) REFERENCES units(unit_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (to_unit_id) REFERENCES units(unit_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 13. Dependents table
CREATE TABLE dependents (
    dependent_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(20) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 14. Payroll table
CREATE TABLE payroll (
    payroll_id INT PRIMARY KEY AUTO_INCREMENT,
    serviceid INT NOT NULL,
    month DATE NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) GENERATED ALWAYS AS (base_salary + allowances) STORED,
    FOREIGN KEY (serviceid) REFERENCES soldiers(serviceid) ON DELETE CASCADE ON UPDATE CASCADE
);
SHOW TABLE

-- Done
