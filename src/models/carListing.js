import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carListingSchema = new Schema(
    {
        brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        series: {type: Schema.Types.ObjectId, ref: 'CarSeries', required: true},
        name: {type: String, required: true, minLength: 1, maxLength: 25},
        year: {type: Number, required: true},
        mileage: {type: Number, required: true},
        available: {type: Boolean, default: true},
        price: {type: Number},
        description: {type: String, minLength: 1, maxLength: 200},
        color: {type: String, enum: ['White', 'Black', 'Grey', 'Blue', 'Red', 'Orange', 'Green'], minLength: 1, maxLength: 20, required: true},
        listing_date: {type: Date, default: Date.now}
    }
);

carListingSchema.virtual('url').get(function() {
    return '/listings/' + this._id;
});

carListingSchema.virtual('formatted_date').get(function() {
    return this.listing_date.toLocaleDateString();
});

export default mongoose.model('CarListing', carListingSchema);