const db = require("./db");
const express = require('express');
const path = require('path');

const productRouter = express();

productRouter.use(express.static(path.join(__dirname, '..')));
productRouter.use(express.static(path.join(__dirname, '..', 'frontend')));
productRouter.use(express.static(path.join(__dirname, '..', 'frontend', 'product')));


productRouter.get("/:id/info", (req, res) => {
    const prodID = req.params.id;

    const query = 'SELECT * FROM products WHERE products_id = ?';
    db.query(query,[prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching data products:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

productRouter.get("/:id/colors", (req, res) => {
    const prodID = req.params.id;

    const query = `
        SELECT c.colors_hex, c.colors_name 
        FROM products_colors pc
        JOIN colors c ON pc.products_colors_cID = c.colors_id
        WHERE pc.products_colors_pID = ?
    `;

    db.query(query, [prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching product colors:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

productRouter.get("/:id/images", (req, res) => {
    const prodID = req.params.id;

    const query = 'SELECT products_images_link FROM products_images WHERE products_images_pID = ?';
    db.query(query, [prodID], (err, rows) => {
        if (err){
            console.error('Error fetching product images:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows)
    });
});

productRouter.get("/:id/colors", (req, res) => {
    const prodID = req.params.id;
    const query = `
    SELECT c.colors_hex, c.colors_name
    FROM products_colors pc
    JOIN colors c ON pc.products_colors_cID = c.colors_id
    WHERE pc.products_colors_pID = ?`;

    db.query(query, [prodID], (err, rows) => {
        if (err){
            console.error('Error fetching product colors:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

productRouter.get("/:id/reviews", (req, res) => {
    const prodID = req.params.id;
    const query = `
    SELECT r.reviews_comment, r.reviews_date, r.reviews_rate, reviews_title, c.clients_name 
    FROM reviews r
    JOIN clients c ON c.clients_id = r.reviews_clients_id
    WHERE r.reviews_products_id = ?
    ORDER BY r.reviews_date DESC`;

    db.query(query, [prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

productRouter.get("/:id/average-rating", (req, res) => {
    const prodID = req.params.id;
    const query = 'SELECT ROUND(AVG(reviews_rate), 1) AS avg_rating FROM reviews WHERE reviews_products_id = ?';

    db.query(query, [prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching average rating:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.send(rows[0].avg_rating);
    });
});

productRouter.get("/:id/rating", (req, res) => {
    const prodID = req.params.id;
    const query = `
    SELECT reviews_rate, COUNT(*) as count
    FROM reviews
    WHERE reviews_products_id = ?
    GROUP BY reviews_rate
    ORDER BY reviews_rate DESC`;

    db.query(query, [prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching rating:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(rows);
    });
});

productRouter.get("/:name/:id", (req, res) => {
    const filepath = path.join(__dirname, '..', 'frontend', 'product', 'index.html');
    res.sendFile(filepath);
});
 module.exports = productRouter;
