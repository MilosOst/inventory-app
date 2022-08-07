import Brand from '../models/brand.js'
import CarSeries from '../models/carSeries.js';
import CarListing from '../models/carListing.js';
import {body, validationResult} from 'express-validator';
import * as async from 'async';
import mongoose, { Mongoose } from 'mongoose';

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

// Display Brand detail page on GET
export async function brand_detail_get(req, res, next) {
    try {
        // First, check that brand exists
        const brand = await Brand.findOne({name: req.params.id}).collation({locale: 'en', strength: 2});

        if (!brand) res.render('not_found', {context: 'brand', value: req.params.id});
        
        const seriesList = await CarSeries.find({brand: brand._id});
        const listings = await CarListing.find({brand: brand._id}).populate('series');

        res.render('brand_detail', {brand_name: brand.name, seriesList, listings})
    }
    catch (err) {
        return next(err);
    }
}

// Display Brand create form on GET
export function brand_create_get(req, res, next) {
    res.render('brand_create_form', {title: 'Create Brand'})
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
                    res.render('brand__create_form', {brand: brand, errors: [duplicateError]});
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

// Display Brand delete form on GET
export async function brand_delete_get(req, res, next) {

    try {
        // Check that brand exists
        const brand = await Brand.findOne({name: req.params.id}).collation({locale: 'en', strength: 2});

        if (brand) {
            res.render('brand_delete', {type: 'brand', brand: req.params.id});
        }
        else {
            res.render('not_found', {context: 'brand', value: req.params.id});
        }
    }
    catch (err) {
        return next(err);
    }
}

// Handle Brand delete on POST
export async function brand_delete_post(req, res, next) {

    try {
        const brand = await Brand.findOne({name: req.params.id});
        const brand_id = brand._id;

        await Promise.all([
            CarSeries.deleteMany({brand: brand_id}),
            CarListing.deleteMany({brand: brand_id}),
            Brand.findByIdAndDelete(brand_id),
        ]);

        res.redirect('/');
    }
    catch (err) {
        return next(err);
    }
}