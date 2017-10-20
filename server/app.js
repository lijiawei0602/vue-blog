import Koa from 'koa';
import convert from 'koa-convert';
import onerror from 'koa-onerror';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bodyParser from 'koa-bodyParser';
import cors from 'koa2-cors';

import config from './configs';
import middleware from './middleware';
import historyApiFallback from './middleware/historyApiFallback';
import router from './routes';

const app = new Koa();

//中间件
app.use(middleware());
app.use(bodyParser());
app.use(cors({
    allowMethods: ['GET', 'POST', 'DELETE',"OPTIONS", "PUT", "PATCH"],
}));
onerror(app);

//解决history模式下的路径文件报错
app.use(convert(historyApiFallback({
    verbose: true,  //激活日志记录
    index: "/admin.html",
    rewrites: [
        { from: '/^\/admin$/', to: '/^\/admin.html' },
        { from: '/^\/admin/login/', to: '/^\/admin.html' }
    ],
    path: '/^\/admin/'
})));

//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

//连接数据库:mongod --dbpath D:\NOSQL\data\db
var db = mongoose.connection;
db.on("error",console.error);
mongoose.connect(config.mongodb.url,config.mongodbSecret);

//create server
app.listen(config.app.port , () => {
    console.log("The server is running at http://localhost:" + config.app.port);
});
