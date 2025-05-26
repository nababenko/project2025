const db = require("./db");
const express = require('express');
const path = require('path');
const multer = require('multer');

const categoriesRouter = express();
const upload = multer();

categoriesRouter.use(express.static(path.join(__dirname, '..')));
categoriesRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
categoriesRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_categories')));

categoriesRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_categories', 'index.html');
    res.sendFile(filepath);
});


categoriesRouter.post("/category",upload.none(), (req, res) => {
    const { name, description } = req.body;

        db.query('INSERT INTO categories (categories_name, categories_description) VALUES (?,?)',
            [name, description],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'data inserted successfully' });
            }
        );
    });


categoriesRouter.get('/data', (req, res) => {
    let sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
categoriesRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM categories WHERE categories_id = ?';
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

categoriesRouter.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    let sql = 'UPDATE categories SET ? WHERE categories_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data updated successfully');
    });
});

categoriesRouter.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM categories WHERE categories_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});


module.exports = categoriesRouter;