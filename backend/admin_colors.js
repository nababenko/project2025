const db = require("./db");
const express = require('express');
const path = require('path');
const multer = require("multer");

const colorsRouter = express();

const upload = multer();


colorsRouter.use(express.static(path.join(__dirname, '..')));
colorsRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
colorsRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_colors')));

colorsRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_colors', 'index.html');
    res.sendFile(filepath);
});



colorsRouter.post("/colors", upload.none(),(req, res) => {
    const { name, hex } = req.body;

        db.query('INSERT INTO colors (colors_name, colors_hex) VALUES (?,?)',
            [name, hex],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Product inserted successfully' });
            }
        );
    });
colorsRouter.post("/colors-products-add",upload.none(), (req, res) => {
    const { c_id, p_id } = req.body;

    db.query('INSERT INTO products_colors (products_colors_cID, products_colors_pID) VALUES (?,?)',
        [c_id, p_id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Product inserted successfully' });
        }
    );
});


colorsRouter.get('/colors-products', (req, res) => {
    const sql = 'SELECT * FROM products_colors';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products-colors:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
colorsRouter.get('/api/products', (req, res) => {
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

colorsRouter.get('/colorsdata', (req, res) => {
    let sql = 'SELECT * FROM colors';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
colorsRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM colors WHERE colors_id = ?';
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

colorsRouter.post('/colorsedit/:id', upload.none(), (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    console.log('Updating color:', id, newData);

    const sql = 'UPDATE colors SET ? WHERE colors_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('DB error');
        }
        res.send('Data updated successfully');
    });
});

colorsRouter.post('/colorsdelete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM colors WHERE colors_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});

colorsRouter.post('/colorsproductsdelete/:c_id/:p_id', (req, res) => {
    const { c_id, p_id } = req.params;
    let sql = 'DELETE FROM products_colors WHERE products_colors_cID = ? AND products_colors_pID = ?';
    db.query(sql, [c_id, p_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.send('Data deleted successfully');
    });
});



module.exports = colorsRouter;