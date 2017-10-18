import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import config from '../configs';

const router = new Router({
    prefix : config.app.base
});

fs.readdirSync(__dirname)
    .filter(file => 
        (file.indexOf('.') !== 0) && (file.split('.').slice(-1)[0] === 'js') && file !== 'index.js'
    )
    .forEach(file => {
        console.log(file);
        //装载所有子路由
        const route = require(path.join(__dirname , file)).default;
        router.use(route.routes(), route.allowedMethods());
    });

router.get("/",(ctx,next) =>{
    ctx.body = "home page";
});

export default router;