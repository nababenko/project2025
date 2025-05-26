const db = require("./db");
const express = require('express');
const path = require('path');

const categoriesRouter = express();


categoriesRouter.use(express.static(path.join(__dirname, '..')));
categoriesRouter.use(express.static(path.join(__dirname, '..', 'frontend')));
categoriesRouter.use(express.static(path.join(__dirname, '..', 'frontend', 'categories')));

categoriesRouter.get("/", (req, res) => {
    const filepath = path.join(__dirname, '..', 'frontend', 'categories', 'index.html');
    res.sendFile(filepath);
});


categoriesRouter.get("/categories_lst", (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.json(rows);
    });
});


module.exports = categoriesRouter;