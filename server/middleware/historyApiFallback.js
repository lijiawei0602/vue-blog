export default function historyApiFallback(options){
    const history = require('connect-history-api-fallback')(options);
    const url = require('url');
    return (ctx, next) => {
        let parseUrl = url.parse(ctx.req.url);
        //不匹配的路由直接穿过该中间件
        if(!parseUrl.pathname.match(options.path)){
            return next();
        }
        ctx.type = 'html';
        return history(ctx.req, ctx.res, next);
    }
};