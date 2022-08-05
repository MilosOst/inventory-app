import Brand from '../models/brand.js'
import {body, validationResult} from 'express-validator';

export function index(req, res, next) {
    Brand.find().exec(function (err, list_brands) {
        if (err) {
            return next(err);
        }
        else {
            res.render('brands', {list_brands})
        }
    });
}

// Display Brand create form on GET
export function brand_create_get(req, res, next) {
    res.render('brand_form', {title: 'Create Brand'})
};

// Handle Brand create on POST
export const brand_create_post = [
    // Validate and sanitize data
    body('name', 'Brand Name must be specified.').trim().isLength({min: 1}).escape().isAlpha().withMessage('Brand Name must contain only letters.'),

    // Process request after validation and sanitization
    (req, res, next) => {
        const errors = validationResult(req);

        const brand = new Brand({name: req.body.name});

        if (!errors.isEmpty()) {
            // There are errors, render form again with given data and error messages
            res.render('brand_form', {
                title: 'Create Brand',
                brand,
                errors: errors.array(),
            });
        }
        else {
            // Check if Brand with the given name already exists
            Brand.findOne({name: req.body.name}).collation({locale: 'en', strength: 2}).exec((err, found_brand) => {
                if (err) return next(err);

                if (found_brand) {
                    // Brand already exists, display error
                    const duplicateError = new Error('A Brand with this name already exists.')
                    res.render('brand_form', {brand: brand, errors: [duplicateError]});
                }
                else {
                    brand.save((err) => {
                        if (err) return next(err);
                        
                        // Brand saved, redirect to brand detail page
                        res.redirect(brand.url);
                    });
                }
            });
        }
    }
];
