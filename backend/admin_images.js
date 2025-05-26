const db = require("./db");
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require("fs");

const adminimagesRouter = express();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


adminimagesRouter.use(express.static(path.join(__dirname, '..')));
adminimagesRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
adminimagesRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_images')));

adminimagesRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_images', 'images.html');
    res.sendFile(filepath);
});


adminimagesRouter.post("/image", upload.single('photo'), (req, res) => {
    const { product_id, color_id } = req.body;


    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const photo = req.file.buffer;
    const filePath = `./uploads/${req.file.originalname}`;

    fs.writeFile(filePath, photo, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'File could not be saved' });
        }

        const imageUrl = `http://localhost:3000/${filePath}`;

        db.query('INSERT INTO products_images (products_images_pID, products_images_cID, products_images_link) VALUES (?,?,?)',
            [product_id, color_id, imageUrl],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'data inserted successfully' });
            }
        );
    });
});

adminimagesRouter.get('/api/colors', (req, res) => {
    const sql = 'SELECT colors_id, colors_name FROM colors';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
adminimagesRouter.get('/api/products', (req, res) => {
    const sql = 'SELECT products_id FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});
adminimagesRouter.get('/data', (req, res) => {
    let sql = 'SELECT * FROM products_images';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});
//
adminimagesRouter.get('/data/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM products_images WHERE products_images_id = ?';
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

adminimagesRouter.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    let sql = 'UPDATE products_images SET ? WHERE products_images_id = ?';
    db.query(sql, [newData, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data updated successfully');
    });
});

adminimagesRouter.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM products_images WHERE products_images_id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Data deleted successfully');
    });
});


module.exports = adminimagesRouter;