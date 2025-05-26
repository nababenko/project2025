const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRouter = require('./admin_page');
const categoriesRouter = require('./categories');
const categoryRouter = require('./category');
const adminimagesRouter = require('./admin_images');
const admincategoriesRouter = require('./admin_categories');
const admincolorsRouter = require('./admin_colors');
const adminreviewsRouter = require('./admin_reviews');
const adminclientsRouter = require('./admin_clients');
const admincartsRouter = require('./admin_carts');

router.use(express.static(path.join(__dirname, '..', 'frontend')));
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.use('/admin', adminRouter);
router.use('/categories', categoriesRouter);
router.use('/category', categoryRouter);
router.use('/adminimages', adminimagesRouter);
router.use('/admincategories', admincategoriesRouter);
router.use('/admincolors', admincolorsRouter);
router.use('/adminreviews', adminreviewsRouter);
router.use('/adminclients', adminclientsRouter);
router.use('/admincarts', admincartsRouter);



module.exports = router;
