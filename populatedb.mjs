import * as async from 'async';
import mongoose from 'mongoose';

import Brand from './src/models/brand.js';
import CarSeries from './src/models/carSeries.js';
import CarListing from './src/models/carListing.js';

const userArgs = process.argv.slice(2);

const mongoDb = userArgs[0];
mongoose.connect(mongoDb, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

let brands = [];
let carSeries = [];
let carListings = [];

function brandCreate(name, cb) {
    const brand = new Brand({name: name});

    brand.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Brand: ' + brand);
        brands.push(brand);
        cb(null, brand);
    });
}

function carModelCreate(name, brand, description, cb) {
    const carModel = new CarSeries({name, brand, description: description.slice(0, 200)});

    carModel.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Car Model: ' + carModel);
        carSeries.push(carModel);
        cb(null, carModel);
    });
}

function carListingCreate(brand, series, name, year, mileage, available, price, description, color, cb) {
    const carListing = new CarListing({brand, series, name, year, mileage, available, price, description: description.slice(0, 200), color});

    carListing.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Car Listing: ' + carListing);
        carListings.push(carListing);
        cb(null, carListing);
    })
}

function createBrands(cb) {
    async.series([
        function(callback) {
           brandCreate('BMW', callback); 
        },
        function(callback) {
            brandCreate('Audi', callback); 
        },
        function(callback) {
            brandCreate('Toyota', callback); 
        },
        function(callback) {
            brandCreate('Honda', callback); 
        },
        function(callback) {
            brandCreate('Infiniti', callback); 
        },
        function(callback) {
            brandCreate('Lexus', callback); 
        }
    ], cb);
}

function createCarModels(cb) {
    async.series([
        function(callback) {
            carModelCreate('5 Series', brands[0], 'The BMW 5 series is the epitome of a sporty and comfortable business sedan. The vehicles combine the equipment options of their time with dynamic driving characteristics made possible by perfectly coordinated suspensions and powerful efficient engines. An elegant look guarantees an appropriate appearance for any situation.', callback)
        },
        function (callback) {
            carModelCreate('Camry', brands[2], 'The Camry is a mainstay of the midsize sedan segment, which has been losing both entries and sales in recent years as the world has embraced SUVs. Nevertheless, while the market has changed the Camry has continued to top the sales charts as the number-one selling passenger cars, a spot it’s held for the past twenty years. It has a well-earned reputation reliability, and it offers a hybridized version that returns exceptional fuel economy. The current generation of the Camry borders on stylish, especially when optioned with the Nightshade package—which adds bronze wheels for 2023—or the sporty-looking TRD trim.', callback)
        },
        function (callback) {
            carModelCreate('G', brands[4], 'The Infiniti G-series is a line of compact executive car produced by Infiniti, a luxury division of Nissan for the 1991–1996 and 1999–2016 model years.', callback)
        },
    ], cb);
}

function createCarListings(cb) {
    async.parallel([
        function (callback) {
            carListingCreate(brands[0], carSeries[0], '550i', 2021, 1800, true, 18000, 'Barely used 2021 M5 in great condition. Contact me for more info.', 'Blue', callback);
        },
        function (callback) {
            carListingCreate(brands[0], carSeries[0], '550i', 2018, 1800, true, 48200, 'Used 2018 M5 in good condition. Willing to negotiate on the price.', 'Black', callback);
        },
    ], cb)
}

async.series([
    createBrands,
    createCarModels,
    createCarListings
], function (err, results) {
    if (err) {
        console.log('Final err: ' + err);
    }
    else {
        console.log('Car Listings: ' + carListings);
    }
    mongoose.connection.close();
});