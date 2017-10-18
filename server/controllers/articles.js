import Article from '../models/articles.js';

/*----- 创建文章 -----*/
export async function createArticle(ctx){
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const abstract = ctx.request.body.abstract;
    const tags = ctx.request.body.tags;
    const publish = ctx.request.body.publish;
    const createTime = new Date;
    const lastEditTime = new Date();
    if(title == ''){
        ctx.throw(400,"标题不能为空");
    }
    if(content == ''){
        ctx.throw(400,"内容不能为空");
    }
    if(abstract == ''){
        ctx.throw(400,"摘要不能为空");
    }

    const article = new Article({
        title,
        content,
        abstract,
        tags,
        publish,
        createTime,
        lastEditTime
    });

    let createResult = await article.save().catch(err => {
        ctx.throw(500,"服务器内部错误");
    });

    //model填充
    await Article.populate(createResult, { path: 'tags'}, function(err,result){
        createResult = result;
    });
    console.log("文章创建成功");
    ctx.body = {
        success: true,
        article: createResult
    };
};

/*----- 按照标签获取对应所有文章 -----*/
export async function getAllArticles(ctx){
    const tag = ctx.query.tag;      //所要查询的标签
    const page = +ctx.query.page;    //所要查询的页数
    const limit = +ctx.query.limit || 4; //所要查询的每页的数量
    let skip = 0;   //查询时跳过的数量
    let articleArr; //文章数组
    let allPage;    //文章页数
    let allNum;     //文章数量

    if(page !== 0){
        skip = limit * (page -1);
    }
    //按照创建时间逆序排列，分页查询
    //查询时无标签要求，则获取全部文章
    if(tag == ''){
        articleArr = await Article.find()
            .populate("tags")
            .skip(skip)
            limit(limit)
            .sort({ createTime: -1 }).catch(err => {
                ctx.throw(500,"服务器错误");
            });
        allNum = await Article.count().catch(err => {
            ctx.throw(500,"服务器错误");
        });
    }else{
        //获取指定标签范围内的文章
        let tagArr = tag.split(",");
        articleArr = await Article.find({
            tags: { "$in": tagArr }
        })
            .populate("tags")
            .sort({ createTime: -1})
            .skip(skip).catch(err => {
                ctx.throw(500,"服务器错误");
            });
        allNum = await Article.find({
            tags: { "$in": tagArr }
        }).count().catch(err => {
            ctx.throw(500,"服务器错误");
        });
    }
    allPage = Math.ceil(allNum / limit);
    ctx.body = {
        success:true,
        articleArr,
        allPage:allPage
    };
};

/*----- 按照标签获取全部发表的文章 -----*/
export async function getAllPublishArticles(ctx){
    const tag = ctx.query.tag
    const page = +ctx.query.page;
    const limit = +ctx.query.limit || 4;
    let skip = 0;
    let articleArr;
    let allNum;
    let allPage;

    if(page !== 0){
        skip = limit * (page -1);
    }

    if(tag == ''){
        articleArr = await Article.find({
            publish: true
        })
        .populate("tags")
        .skip(skip)
        .limit(limit)
        .sort({ createTime: -1 }).catch(err => {
            ctx.throw(500,"服务器错误");
        });
        allNum = await Article.find({
            publish: true
        }).count().catch(err => {
            ctx.throw(500,"服务器错误");
        });
    }else{
        let tagArr = tag.split(",");

        articleArr = await Article.find({
            publish: true,
            tags: { '$in': tagArr }
        })
        .populate("tags")
        .skip(skip)
        .limit(limit)
        .sort({ createTime: -1 }).catch(err => {
            ctx.throw(500,"服务器错误");
        });
        allNum = await Article.find({
            publish: true,
            tags: { '$in': tagArr }
        }).count().catch(err => {
            ctx.throw(500,"服务器错误");
        });
    }
    allPage = Math.ceil(allNum / limit);
    
    ctx.body = {
        success: true,
        articleArr,
        allPage
    };
};


/*----- 修改文章 -----*/
export async function modifyArticle(ctx){
    const id = ctx.query.id;
    const title = ctx.request.body.title;
    const content = ctx.request.body.content;
    const abstract = ctx.request.body.abstract;
    const tags = ctx.request.body.tags;
    if(title == ''){
        ctx.throw(400,"标题不能为空");
    }
    if(content == ''){
        ctx.throw(400,"内容不能为空");
    }
    if(abstract == ''){
        ctx.throw(400,"摘要不能为空");
    }
    if(tags.length == 0){
        ctx.throw(400,"标签不能为空");
    }

    const article = await Article.findByIdAndUpdate(id, { $set: ctx.request.body }).catch(err => {
        if(err.name === "CastError"){
            ctx.throw(400,"ID不存在");
        }else{
            ctx.throw(500,"服务器错误");
        }

        ctx.body = {
            success: true
        };
    });
};

/*----- 删除文章 -----*/
export async function deleteArticle(ctx){
    const id = ctx.query.id;
    const article = await Article.findByIdAndRemove(id).catch(err => {
        if(err.name == "CastError"){
            ctx.throw(400,"id不存在");
        }else{
            ctx.throw(500,"服务器错误");
        }
    });

    ctx.body = {
        success: true
    };
};

/*----- 按照ID获取对应文章 -----*/
export async function getArticle(ctx){
    const id = ctx.query.id;
    if(id == ''){
        ctx.throw(400,"id不能为空");
    }

    const article = await Article.findById(id).catch(err => {
        if(err.name == "CastError"){
            ctx.throw(400,"id不存在");
        }else{
            ctx.throw(500,"服务器错误");
        }
    });

    ctx.body = {
        success: true,
        article: article
    };
};

/*----- 修改文章发表状态为:true -----*/
export async function publishArticle(ctx){
    const id = ctx.query.id;
    const article = await Article.findByIdAndUpdate(id, { $set: { publish: true }}).catch(err => {
        if(err.name == 'CastName'){
            ctx.throw(400,"id不存在");
        }else{
            ctx.throw(500,"服务器错误");
        }
    });
    ctx.body = {
        success: true
    };
}

/*----- 修改文章发表状态为:false -----*/
export async function notPublishArticle(ctx){
    const id = ctx.query.id;
    const article = await Article.findByIdAndUpdate(id, { $set: { publish: false }}).catch(err => {
        if(err.name == "CastError"){
            ctx.throw(400,"id不存在");
        }else{
            ctx.throw(500,"服务器错误");
        }
    });
    ctx.body = {
        success: true
    };
};