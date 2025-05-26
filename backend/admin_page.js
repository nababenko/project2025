const db = require("./db");
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require("fs");

const adminRouter = express();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


adminRouter.use(express.static(path.join(__dirname, '..')));
adminRouter.use(express.static(path.join(__dirname,'..', 'frontend')));
adminRouter.use(express.static(path.join(__dirname,'..','frontend', 'admin_page')));

adminRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname,'..','frontend','admin_page', 'index.html');
    res.sendFile(filepath);
});


adminRouter.post("/product", upload.single('photo'), (req, res) => {
    const { name, designer, description, price, category } = req.body;


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

        db.query('INSERT INTO products (products_name, products_designer, products_description, products_price, products_categories_id, products_cover) VALUES (?,?,?,?,?,?)',
            [name, designer, description, price, category, imageUrl],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Product inserted successfully' });
            }
        );
    });
});

adminRouter.get('/api/categories', (req, res) => {
    const sql = 'SELECT categories_id, categories_name FROM categories';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

 adminRouter.get('/data', (req, res) => {
     let sql = 'SELECT * FROM products';
     db.query(sql, (err, results) => {
         if (err) {
             throw err;
         }
        res.json(results);
     });
 });
//
 adminRouter.get('/data/:id', (req, res) => {
     const { id } = req.params;
     let sql = 'SELECT * FROM products WHERE products_id = ?';
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

 adminRouter.post('/edit/:id', (req, res) => {
     const { id } = req.params;
     const newData = req.body;
     let sql = 'UPDATE products SET ? WHERE products_id = ?';
     db.query(sql, [newData, id], (err, result) => {
        if (err) {
             throw err;
         }
         res.send('Data updated successfully');
     });
 });

 adminRouter.post('/delete/:id', (req, res) => {
     const { id } = req.params;
     let sql = 'DELETE FROM products WHERE products_id = ?';
     db.query(sql, id, (err, result) => {
        if (err) {
             throw err;
         }
         res.send('Data deleted successfully');
     });
 });


module.exports = adminRouter;