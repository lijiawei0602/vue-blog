import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: String,
    default: ''
});

tagSchema.set("toJSON",{ getters: true, virtuals: true});
tagSchema.set("toObject", { getters: true, virtuals: true});

export default mongoose.model("tag",tagSchema);