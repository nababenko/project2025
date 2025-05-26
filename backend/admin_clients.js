const db = require("./db");
const express = require('express');
const path = require('path');

const adminclientsRouter = express();



adminclientsRouter.use(express.static(path.join(__dirname, '..')));
adminclientsRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
adminclientsRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_clients')));

adminclientsRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_clients', 'index.html');
    res.sendFile(filepath);
});



adminclientsRouter.post("/clients", (req, res) => {
    const { clients_email, clients_password, clients_name, clients_surname } = req.body;

    db.query('INSERT INTO clients (clients_email, clients_password, clients_name, clients_surname) VALUES (?,?,?,?)',
        [clients_email, clients_password, clients_name, clients_surname],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'client inserted successfully' });
        }
    );
});
adminclientsRouter.post("/likes-add", (req, res) => {
    const { c_id, p_id } = req.body;

    db.query('INSERT INTO likes (likes_clients_id, likes_products_id) VALUES (?,?)',
        [c_id, p_id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'like inserted successfully' });
        }
    );
});


adminclientsRouter.get('/likes', (req, res) => {
    const sql = 'SELECT * FROM likes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching likes:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
adminclientsRouter.get('/api/products', (req, res) => {
    const sql = 'SELECT products_id FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products-colors:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

adminclientsRouter.get('/clientsdata', (req, res) => {
    let sql = 'SELECT * FROM clients';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
adminclientsRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM clients WHERE clients_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Data not found' });
            return;
        }
        res.json(result[0]);
    });
});

adminclientsRouter.post('/clientsedit/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    let sql = 'UPDATE clients SET ? WHERE clients_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data updated successfully');
    });
});

adminclientsRouter.post('/clientsdelete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM clients WHERE clients_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});

//дописати редагування видалення лайків


module.exports = adminclientsRouter;