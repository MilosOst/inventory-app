import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carModelSchema = new Schema(
    {
        name: {type: String, required: true, minLength: 1, maxLength: 25},
        brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
        description: {type: String, minLength: 1, maxLength: 200},
    }
);

export default mongoose.model('CarSeries', carModelSchema);