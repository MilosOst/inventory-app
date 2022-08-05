import Brand from '../models/brand.js';
import CarListing from '../models/carListing.js';
import * as async from 'async';

export function index(req, res, next) {
    async.parallel({
        brands(callback) {
            Brand.find(callback);
        },
        listings_count(callback) {
            CarListing.countDocuments({}, callback)
        }
    }, (err, results) => {
        if (err) return next(err);

        res.render('index', {brands: results.brands, numListings: results.listings_count})
    });
}