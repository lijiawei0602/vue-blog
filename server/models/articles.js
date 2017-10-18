import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const articleSchema = new Schema({
    title : String,
    content : String,
    abstract : String,
    tags : [{
        type : Schema.Types.ObjectId,
        ref : "tag"     //添加ref属性来指向另一个Schema, 该ref属性在此后被填充（populate）时将被mongoose读取。
    }],
    publish :{
        type : Boolean,
        default : false
    },
    createTime : Date,
    lastEditTime :{
        type : Date,
        default : Date.now
    }
});

articleSchema.set("toJSON", { getters: true, virtuals: true});
articleSchema.set("toObject", { getters: true, virtuals: true});

export default mongoose.model("article", articleSchema);