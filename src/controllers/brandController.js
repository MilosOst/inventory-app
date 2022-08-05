import Brand from '../models/brand.js'

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