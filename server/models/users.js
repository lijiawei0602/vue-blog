import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    avator: String,
    createTime: String
},{ versionKey: false });

module.exports = mongoose.model('user', userSchema);