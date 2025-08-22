const db = require("./db");
const express = require('express');
const path = require('path');

const categoryRouter = express();


categoryRouter.use(express.static(path.join(__dirname, '..')));
categoryRouter.use(express.static(path.join(__dirname, '..', 'frontend')));
categoryRouter.use(express.static(path.join(__dirname, '..', 'frontend', 'category')));

categoryRouter.get("/:name", (req, res) => {
    const filepath = path.join(__dirname, '..', 'frontend', 'category', 'index.html');
    res.sendFile(filepath);
});


categoryRouter.get("/:name/products", (req, res) => {
    const categoryName = req.params.name;
    const { sortField, sortOrder, designer, color } = req.query;

    const getID = 'SELECT categories_id FROM categories WHERE categories_name = ?';

    db.query(getID, [categoryName], (err, idResult) => {
        if (err) {
            console.error('Error fetching category ID:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (idResult.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const categoryId = idResult[0].categories_id;
        let query = `SELECT DISTINCT p.*
        FROM products p 
        LEFT JOIN products_colors pc ON p.products_id = pc.products_colors_pID
        LEFT JOIN colors c ON pc.products_colors_cID = c.colors_id
        WHERE p.products_categories_id=?`;
        let params = [categoryId];

        // Фільтрація по дизайнерах
        if (designer) {
            const designers = Array.isArray(designer) ? designer : [designer];
            const placeholders = designers.map(() => '?').join(', ');
            query += ` AND p.products_designer IN (${placeholders})`;
            params.push(...designers);
        }
        if (color) {
            const colorsID = Array.isArray(color) ? color : [color];
            const placeholders = colorsID.map(() => '?').join(', ');
            query += ` AND c.colors_id IN (${placeholders})`;
            params.push(...colorsID);
        }



        // Сортування
        const allowedSortFields = ['name', 'price'];
        const allowedSortOrders = ['asc', 'desc'];
        const fieldMap = {
            name: 'products_name',
            price: 'products_price'
        };

        if (allowedSortFields.includes(sortField) && allowedSortOrders.includes(sortOrder)) {
            query += ` ORDER BY ${fieldMap[sortField]} ${sortOrder.toUpperCase()}`;
        }

        db.query(query, params, (err, rows) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            res.json(rows);
        });
    });
});
categoryRouter.get("/products/:id/colors", (req, res) => {
    const prodID = req.params.id;
    const query = `
    SELECT c.colors_hex
    FROM products_colors pc
    JOIN colors c ON pc.products_colors_cID = c.colors_id
    WHERE pc.products_colors_pID = ?`;

    db.query(query, [prodID], (err, rows) => {
        if (err) {
            console.error('Error fetching product colors:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        const hexList = rows.map((row) => row.colors_hex);
        res.json(hexList);
    });
});


module.exports = categoryRouter;