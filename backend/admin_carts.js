const db = require("./db");
const express = require('express');
const path = require('path');

const admincartsRouter = express();



admincartsRouter.use(express.static(path.join(__dirname, '..')));
admincartsRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
admincartsRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_carts')));

admincartsRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_carts', 'index.html');
    res.sendFile(filepath);
});



admincartsRouter.post("/carts", (req, res) => {
    const { carts_clients_id, carts_date } = req.body;

    db.query('INSERT INTO carts (carts_clients_id, carts_date) VALUES (?,?)',
        [carts_clients_id, carts_date],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Cart inserted successfully' });
        }
    );
});
admincartsRouter.post("/carts-products-add", (req, res) => {
    const {carts_products_cID, carts_products_pID, carts_products_quantity } = req.body;

    db.query('INSERT INTO carts_products (carts_products_cID, carts_products_pID, carts_products_quantity) VALUES (?,?,?)',
        [carts_products_cID, carts_products_pID, carts_products_quantity],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'data inserted successfully' });
        }
    );
});


admincartsRouter.get('/carts-products', (req, res) => {
    const sql = 'SELECT * FROM carts_products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching carts_products:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
admincartsRouter.get('/api/products', (req, res) => {
    const sql = 'SELECT products_id FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
admincartsRouter.get('/api/clients', (req, res) => {
    const sql = 'SELECT clients_id FROM clients';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

admincartsRouter.get('/cartsdata', (req, res) => {
    let sql = 'SELECT * FROM carts';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
admincartsRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM carts WHERE carts_id = ?';
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

admincartsRouter.post('/cartsedit/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    let sql = 'UPDATE carts SET ? WHERE carts_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data updated successfully');
    });
});

admincartsRouter.post('/cartsdelete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM carts WHERE carts_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});


module.exports = admincartsRouter;