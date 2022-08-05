import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carSeriesSchema = new Schema(
    {
        name: {type: String, required: true, minLength: 1, maxLength: 25},
        brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        description: {type: String, minLength: 1, maxLength: 200},
    }
);

carSeriesSchema.virtual('url').get(function() {
    return '/brands/makes/' + this.name;
});

export default mongoose.model('CarSeries', carSeriesSchema);