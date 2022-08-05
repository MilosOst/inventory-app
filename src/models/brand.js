import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BrandSchema = new Schema(
    {
        name: {type: String, required: true, minLength: 1, maxLength: 25},
    }
);

BrandSchema.virtual('url').get(function() {
    return '/brands/' + this.name; 
});

export default mongoose.model('Brand', BrandSchema);