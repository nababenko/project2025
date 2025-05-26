const db = require("./db");
const express = require('express');
const path = require('path');

const adminreviewsRouter = express();


adminreviewsRouter.use(express.static(path.join(__dirname, '..')));
adminreviewsRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
adminreviewsRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_reviews')));

adminreviewsRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_reviews', 'index.html');
    res.sendFile(filepath);
});



adminreviewsRouter.get('/api/product', (req, res) => {
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
adminreviewsRouter.get('/api/client', (req, res) => {
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

adminreviewsRouter.get('/data', (req, res) => {
    let sql = 'SELECT * FROM reviews ORDER BY reviews_id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
adminreviewsRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM reviews WHERE reviews_id = ?';
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

adminreviewsRouter.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    let sql = 'UPDATE reviews SET ? WHERE reviews_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data updated successfully');
    });
});

adminreviewsRouter.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM reviews WHERE reviews_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});


module.exports = adminreviewsRouter;