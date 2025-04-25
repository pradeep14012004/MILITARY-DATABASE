const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Database connection
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Database connection test failed:', err);
    } else {
        console.log('Database connection test succeeded:', results);
    }
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/aasi', (req, res) => res.sendFile(path.join(__dirname, 'public', 'aSsi.html')));
app.get('/dep', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dep.html')));
app.get('/depe', (req, res) => res.sendFile(path.join(__dirname, 'public', 'depe.html')));
app.get('/equip', (req, res) => res.sendFile(path.join(__dirname, 'public', 'equip.html')));
app.get('/inju', (req, res) => res.sendFile(path.join(__dirname, 'public', 'inju.html')));
app.get('/med', (req, res) => res.sendFile(path.join(__dirname, 'public', 'med.html')));
app.get('/miss', (req, res) => res.sendFile(path.join(__dirname, 'public', 'miss.html')));
app.get('/pay', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pay.html')));
app.get('/prom', (req, res) => res.sendFile(path.join(__dirname, 'public', 'prom.html')));
app.get('/qua', (req, res) => res.sendFile(path.join(__dirname, 'public', 'qua.html')));
app.get('/sold', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sold.html')));
app.get('/train', (req, res) => res.sendFile(path.join(__dirname, 'public', 'train.html')));
app.get('/trans', (req, res) => res.sendFile(path.join(__dirname, 'public', 'trans.html')));
app.get('/unit', (req, res) => res.sendFile(path.join(__dirname, 'public', 'unit.html')));

// Example API Endpoints for Soldiers
app.get('/api/soldiers', (req, res) => {
    const fetchSoldiersQuery = 'SELECT * FROM soldiers';
    db.query(fetchSoldiersQuery, (err, results) => {
        if (err) {
            console.error('Error fetching soldiers:', err);
            res.status(500).send('Error fetching soldiers');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/soldiers', (req, res) => {
    const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        rank,
        branch,
        unit_id,
        enlistment_date,
        discharge_date,
        status,
        blood_type,
        last_known_location,
    } = req.body;

    // Check if the unit_id exists
    const checkUnitQuery = 'SELECT * FROM units WHERE unit_id = ?';
    db.query(checkUnitQuery, [unit_id], (err, results) => {
        if (err) {
            console.error('Error checking unit ID:', err);
            res.status(500).send('Error checking unit ID');
            return;
        }

        if (results.length === 0) {
            res.status(400).send('Unit ID does not exist in the units table');
            return;
        }

        // Insert the soldier if the unit exists
        const insertSoldierQuery = `
            INSERT INTO soldiers (first_name, last_name, date_of_birth, gender, \`rank\`, branch, unit_id, enlistment_date, discharge_date, status, blood_type, last_known_location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertSoldierQuery,
            [
                first_name,
                last_name,
                date_of_birth,
                gender,
                rank,
                branch,
                unit_id,
                enlistment_date,
                discharge_date,
                status,
                blood_type,
                last_known_location,
            ],
            (err, results) => {
                if (err) {
                    console.error('Error adding soldier:', err);
                    res.status(500).send('Error adding soldier');
                } else {
                    res.status(200).send('Soldier added successfully');
                }
            }
        );
    });
});

app.put('/api/soldiers/:id', (req, res) => {
    const { id } = req.params;
    const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        rank,
        branch,
        unit_id,
        enlistment_date,
        discharge_date,
        status,
        blood_type,
        last_known_location,
    } = req.body;

    const updateSoldierQuery = `
        UPDATE soldiers
        SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, rank = ?, branch = ?, unit_id = ?, enlistment_date = ?, discharge_date = ?, status = ?, blood_type = ?, last_known_location = ?
        WHERE serviceid = ?
    `;
    db.query(
        updateSoldierQuery,
        [
            first_name,
            last_name,
            date_of_birth,
            gender,
            rank,
            branch,
            unit_id,
            enlistment_date,
            discharge_date,
            status,
            blood_type,
            last_known_location,
            id,
        ],
        (err, results) => {
            if (err) {
                console.error('Error updating soldier:', err);
                res.status(500).send('Error updating soldier');
            } else {
                res.status(200).send('Soldier updated successfully');
            }
        }
    );
});

app.delete('/api/soldiers/:id', (req, res) => {
    const { id } = req.params;

    const deleteSoldierQuery = 'DELETE FROM soldiers WHERE serviceid = ?';
    db.query(deleteSoldierQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting soldier:', err);
            res.status(500).send('Error deleting soldier');
        } else {
            res.status(200).send('Soldier deleted successfully');
        }
    });
});

app.post('/api/sold', (req, res) => {
  const {
    field1, // Ensure this matches the column name in the database
    field2, // Ensure this matches the column name in the database
    field3, // Ensure this matches the column name in the database
  } = req.body;

  const query = 'INSERT INTO sold_table (field1, field2, field3) VALUES (?, ?, ?)';
  db.query(query, [field1, field2, field3], (err, results) => {
    if (err) {
      console.error('Error inserting data into sold_table:', err);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).send('Data added successfully to sold_table');
    }
  });
});

app.post('/api/qua', (req, res) => {
    const { serviceid, course_id, date_completed, score } = req.body;

    const query = `
        INSERT INTO qua_table (serviceid, course_id, date_completed, score)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [serviceid, course_id, date_completed, score], (err, results) => {
        if (err) {
            console.error('Error inserting data into qua_table:', err);
            res.status(500).send('Error saving qualification');
        } else {
            res.status(200).send('Qualification saved successfully');
        }
    });
});

app.get('/api/qua', (req, res) => {
    const query = 'SELECT * FROM qua_table';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching qualifications:', err);
            res.status(500).send('Error fetching qualifications');
        } else {
            res.json(results);
        }
    });
});

// Get all units
app.get('/api/units', (req, res) => {
    const unitsData = {
        army: [
            {
                id: "army-1",
                name: "Rajputana Rifles",
                motto: "Veer Bhogya Vasundhara (The brave shall inherit the earth)",
                location: "Delhi Cantonment",
                emblem: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Rajputana_Rifles_Insignia_%28India%29.svg/1200px-Rajputana_Rifles_Insignia_%28India%29.svg.png",
                description: "The Rajputana Rifles is the most senior rifle regiment of the Indian Army...",
                history: "The regiment was formed in 1921 after the First World War...",
                operations: ["Indo-Pakistan War of 1947", "Operation Polo", "Kargil War"],
                honors: ["9 Victoria Crosses", "4 Ashoka Chakras"]
            },
            {
                id: "army-6",
                name: "Dogra Regiment",
                motto: "Kartavyam Anvatma (Duty Before Death)",
                location: "Faizabad, Uttar Pradesh",
                emblem: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Dogra_Regiment_Insignia.png",
                description: "The Dogra Regiment is one of the oldest infantry regiments of the Indian Army.",
                history: "The regiment was raised in 1877 and has participated in numerous wars and operations.",
                operations: ["Indo-Pakistani War of 1947", "Sino-Indian War", "Kargil War"],
                honors: ["2 Param Vir Chakras", "10 Maha Vir Chakras"]
            }
        ],
        navy: [
            {
                id: "navy-1",
                name: "Western Naval Command",
                motto: "The Western Shield",
                location: "Mumbai, Maharashtra",
                emblem: "https://upload.wikimedia.org/wikipedia/commons/4/42/Western_Naval_Command_%28India%29.png",
                description: "The Western Naval Command is the sword arm of the Indian Navy...",
                history: "The Western Naval Command was established in 1968...",
                operations: ["Indo-Pakistani War of 1971", "Operation Talwar"],
                honors: ["INS Vikramaditya", "Multiple guided-missile destroyers"]
            },
            {
                id: "navy-6",
                name: "INS Vikrant",
                motto: "Jayema Sam Yudhi Sprdhah (I defeat those who fight against me)",
                location: "Mumbai, Maharashtra",
                emblem: "https://upload.wikimedia.org/wikipedia/commons/4/42/INS_Vikrant_Emblem.png",
                description: "INS Vikrant is India's first indigenous aircraft carrier.",
                history: "Commissioned in 2022, it represents India's naval self-reliance.",
                operations: ["Maritime exercises", "Strategic deterrence"],
                honors: ["Pride of the Indian Navy"]
            }
        ],
        airforce: [
            {
                id: "airforce-1",
                name: "Western Air Command",
                motto: "Swift and Sure",
                location: "New Delhi",
                emblem: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Wac_jpg.webp",
                description: "The Western Air Command (WAC) is the most important operational command...",
                history: "The Western Air Command was established in 1947...",
                operations: ["Indo-Pakistani Wars", "Kargil War"],
                honors: ["Su-30MKI squadrons", "Mirage 2000 squadrons"]
            },
            {
                id: "airforce-6",
                name: "No. 17 Squadron 'Golden Arrows'",
                motto: "Udayam Ajasram (Arise Ever)",
                location: "Ambala Air Force Station",
                emblem: "https://upload.wikimedia.org/wikipedia/en/7/7d/No._17_Squadron_IAF_Emblem.png",
                description: "The Golden Arrows operate the Rafale fighter jets.",
                history: "The squadron was reactivated in 2019 to induct Rafale aircraft.",
                operations: ["Balakot Airstrike", "Eastern sector air defense"],
                honors: ["1 Param Vir Chakra", "5 Vir Chakras"]
            }
        ]
    };

    res.status(200).json(unitsData);
});

// Add a new unit
app.post('/api/units', (req, res) => {
    const { unit_id, unit_name, unit_type, location, commander_id } = req.body;

    // Check if the unit_id already exists
    const checkUnitQuery = 'SELECT * FROM units WHERE unit_id = ?';
    db.query(checkUnitQuery, [unit_id], (err, results) => {
        if (err) {
            console.error('Error checking unit ID:', err);
            res.status(500).send('Error checking unit ID');
            return;
        }

        if (results.length > 0) {
            res.status(400).send('Unit ID already exists');
            return;
        }

        // Insert the new unit
        const insertUnitQuery = `
            INSERT INTO units (unit_id, unit_name, unit_type, location, commander_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(insertUnitQuery, [unit_id, unit_name, unit_type, location, commander_id], (err, results) => {
            if (err) {
                console.error('Error adding unit:', err);
                res.status(500).send('Error adding unit');
            } else {
                res.status(200).send('Unit added successfully');
            }
        });
    });
});

// Edit a unit
app.put('/api/units/:id', (req, res) => {
    const { id } = req.params;
    const { unit_name, unit_type, location, commander_id } = req.body;

    const updateUnitQuery = `
        UPDATE units
        SET unit_name = ?, unit_type = ?, location = ?, commander_id = ?
        WHERE unit_id = ?
    `;
    db.query(updateUnitQuery, [unit_name, unit_type, location, commander_id, id], (err, results) => {
        if (err) {
            console.error('Error updating unit:', err);
            res.status(500).send('Error updating unit');
        } else {
            res.status(200).send('Unit updated successfully');
        }
    });
});

// Delete a unit
app.delete('/api/units/:id', (req, res) => {
    const { id } = req.params;

    const deleteUnitQuery = 'DELETE FROM units WHERE unit_id = ?';
    db.query(deleteUnitQuery, [id], (err, results) => {
        if (err) {
            console.error('Error deleting unit:', err);
            res.status(500).send('Error deleting unit');
        } else {
            res.status(200).send('Unit deleted successfully');
        }
    });
});

app.get('/api/equipment', (req, res) => {
    const query = 'SELECT * FROM equipment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching equipment:', err);
            res.status(500).send('Error fetching equipment');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/equipment', (req, res) => {
    const { type, serial_number, status } = req.body;

    const checkSerialQuery = 'SELECT * FROM equipment WHERE serial_number = ?';
    db.query(checkSerialQuery, [serial_number], (err, results) => {
        if (err) {
            console.error('Error checking serial number:', err);
            res.status(500).send('Error checking serial number');
            return;
        }

        if (results.length > 0) {
            res.status(400).send('Serial number already exists');
            return;
        }

        const query = 'INSERT INTO equipment (type, serial_number, status) VALUES (?, ?, ?)';
        db.query(query, [type, serial_number, status], (err, results) => {
            if (err) {
                console.error('Error adding equipment:', err);
                res.status(500).send('Error adding equipment');
            } else {
                res.status(200).send('Equipment added successfully');
            }
        });
    });
});

app.put('/api/equipment/:id', (req, res) => {
    const { id } = req.params;
    const { type, serial_number, status } = req.body;

    const query = 'UPDATE equipment SET type = ?, serial_number = ?, status = ? WHERE equipment_id = ?';
    db.query(query, [type, serial_number, status, id], (err, results) => {
        if (err) {
            console.error('Error updating equipment:', err);
            res.status(500).send('Error updating equipment');
        } else {
            res.status(200).send('Equipment updated successfully');
        }
    });
});

app.delete('/api/equipment/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM equipment WHERE equipment_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting equipment:', err);
            res.status(500).send('Error deleting equipment');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Equipment not found');
        } else {
            res.status(200).send('Equipment deleted successfully');
        }
    });
});

app.get('/api/assignments', (req, res) => {
    const query = 'SELECT * FROM assignments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching assignments:', err);
            res.status(500).send('Error fetching assignments');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/api/assignments', (req, res) => {
    const { serviceid, equipment_id, date_assigned, date_returned } = req.body;

    const query = `
        INSERT INTO assignments (serviceid, equipment_id, date_assigned, date_returned)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [serviceid, equipment_id, date_assigned, date_returned || null], (err, results) => {
        if (err) {
            console.error('Error adding assignment:', err);
            res.status(500).send('Error adding assignment');
        } else {
            res.status(200).send('Assignment added successfully');
        }
    });
});

app.put('/api/assignments/:id', (req, res) => {
    const { id } = req.params;
    const { serviceid, equipment_id, date_assigned, date_returned } = req.body;

    const query = `
        UPDATE assignments
        SET serviceid = ?, equipment_id = ?, date_assigned = ?, date_returned = ?
        WHERE assignment_id = ?
    `;
    db.query(query, [serviceid, equipment_id, date_assigned, date_returned || null, id], (err, results) => {
        if (err) {
            console.error('Error updating assignment:', err);
            res.status(500).send('Error updating assignment');
        } else {
            res.status(200).send('Assignment updated successfully');
        }
    });
});

app.delete('/api/assignments/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM assignments WHERE assignment_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting assignment:', err);
            res.status(500).send('Error deleting assignment');
        } else if (results.affectedRows === 0) {
            res.status(404).send('Assignment not found');
        } else {
            res.status(200).send('Assignment deleted successfully');
        }
    });
});

app.post('/api/miss', (req, res) => {
    const { mission_name, objective, status, serviceid, assignment_id } = req.body;

    const query = `
        INSERT INTO missions (mission_name, objective, status, serviceid, assignment_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [mission_name, objective, status, serviceid, assignment_id], (err, results) => {
        if (err) {
            console.error('Error inserting mission:', err);
            res.status(500).send('Error creating mission');
        } else {
            res.status(200).send('Mission created successfully');
        }
    });
});

app.get('/api/miss', (req, res) => {
    const query = `
        SELECT mission_id, mission_name, objective, status, serviceid, assignment_id
        FROM missions
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching missions:', err);
            res.status(500).send('Error fetching missions');
        } else {
            res.status(200).json(results);
        }
    });
});

app.put('/api/miss/:id', (req, res) => {
    const { id } = req.params;
    const { mission_name, objective, status, serviceid, assignment_id } = req.body;

    const query = `
        UPDATE missions
        SET mission_name = ?, objective = ?, status = ?, serviceid = ?, assignment_id = ?
        WHERE mission_id = ?
    `;

    db.query(query, [mission_name, objective, status, serviceid, assignment_id, id], (err, results) => {
        if (err) {
            console.error('Error updating mission:', err);
            res.status(500).send('Error updating mission');
        } else {
            res.status(200).send('Mission updated successfully');
        }
    });
});

app.delete('/api/miss/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM missions
        WHERE mission_id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting mission:', err);
            res.status(500).send('Error deleting mission');
        } else {
            res.status(200).send('Mission deleted successfully');
        }
    });
});

function handleFormSubmit(event) {
    event.preventDefault();

    const mission_name = missionNameInput.value.trim();
    const objective = objectiveInput.value.trim();
    const status = statusInput.value;
    const serviceid = document.getElementById('serviceid').value;
    const assignment_id = document.getElementById('assignment_id').value;

    if (!mission_name || !serviceid || !assignment_id) {
        showAlert('Mission name, Service ID, and Assignment ID are required!', 'danger');
        return;
    }

    const missionId = missionIdInput.value;

    const data = {
        mission_name,
        objective,
        status,
        serviceid,
        assignment_id,
    };

    const method = missionId ? 'PUT' : 'POST';
    const url = missionId ? `/api/miss/${missionId}` : '/api/miss';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save mission');
            }
            return response.text();
        })
        .then(message => {
            showAlert(message, 'success');
            resetForm();
            fetchMissions();
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error saving mission', 'danger');
        });
}

function fetchMissions() {
    fetch('/api/miss')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch missions');
            }
            return response.json();
        })
        .then(data => {
            missions = data;
            displayMissions();
        })
        .catch(error => {
            console.error('Error fetching missions:', error);
            showAlert('Error fetching missions', 'danger');
        });
}

function editMission(id) {
    const mission = missions.find(m => m.mission_id === id);

    if (mission) {
        formTitle.textContent = 'Edit Mission';
        missionIdInput.value = mission.mission_id;
        missionNameInput.value = mission.mission_name;
        objectiveInput.value = mission.objective;
        statusInput.value = mission.status;
        document.getElementById('serviceid').value = mission.serviceid;
        document.getElementById('assignment_id').value = mission.assignment_id;

        submitBtn.textContent = 'Update Mission';
        cancelBtn.style.display = 'inline-block';

        // Scroll to form
        document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
    }
}

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

