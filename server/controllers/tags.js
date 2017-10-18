import Tag from '../models/tags.js';

export async function createTag(ctx) {
    const tagName = ctx.request.body.name;
    if(tagName == ''){
        ctx.throw(400,"标签名不能为空");
    }

    const tag = await Tag.findOne({ name: tagName }).catch(err => {
        ctx.throw(500,"服务器错误");
    });
    if(tag !== null){
        ctx.body = {
            success: true,
            tag: tag
        };
        return;
    }

    const newTag = new Tag({
        name: tagName
    });

    const result = await Tag.save().catch(err => {
        ctx.throw(500,"服务区错误");
    });
    ctx.body = {
        success: true,
        tag: result
    };
};

export async function getAllTags(ctx){
    const tagArr = Tag.find().catch(err => {
        ctx.throw(500,"服务器错误");
    });
    ctx.body = {
        success: true,
        tagArr
    };
};

export async function modifyTag(ctx){
    const id = ctx.query.id;
    const tagName = ctx.request.body.name;
    if(name == ''){
        ctx.throw(400,"标签名不能为空");
    }

    const tag = await Tag.findByIdAndUpdate(id , { $set: { name: tagName } }).catch(err => {
        if(err.name === "CastError"){
            ctx.throw(400, "id不存在");
        }else{
            ctx.throw(500, "服务器代码错误");
        }
    });
    ctx.body = {
        success: true
    };
}

export async function deleteTag(ctx){
    const id = ctx.params.id;
    const tag = await Tag.findByIdAndRemove(id).catch(err => {
        if(err.name == "CastError"){
            ctx.throw(400, "id不存在");
        }else{
            ctx.throw(500, "服务器代码错误");
        }
    });
    ctx.body = {
        success: true
    };
}