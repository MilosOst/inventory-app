import express from "express";

import * as brandController from '../controllers/brandController.js';

const router = express.Router();


// GET request for Brands home page
router.get('/', brandController.index);

// GET request for Brand detail page
router.get('/:id', brandController.brand_detail_get)

// GET request for creating new Brand
router.get('/add', brandController.brand_create_get);

// POST request for creating new Brand
router.post('/add', brandController.brand_create_post);

// GET request for deleting Brand
router.get('/:id/delete', brandController.brand_delete_get);

router.post('/:id/delete', brandController.brand_delete_post);


export default router;