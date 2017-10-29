import User from '../models/users.js';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import config from '../configs';

export async function initUser(ctx){
    let user = await User.find().exec().catch(err => {
        console.log(err);
    });

    console.log(user);

    if(user.length === 0 || user.password !== md5(config.admin.password)){
        //当前没有用户或者用户经过配置文件已经修改
        //先删除已有的用户表，再创建新用户
        await User.deleteMany({}).catch(err => {
            ctx.throw(500, err);
        });


        user = new User({
            name: 'ljw',
            username: config.admin.user,
            password: md5(config.admin.password).toUpperCase(),
            avator:'',
            createTime: new Date()
        });

        console.log(user);

        await user.save().catch(err => {
            console.log(err);
        });
    }
}


export async function login(ctx){
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    let user = await User.findOne({
        username
    }).exec();

    console.log(user);

    if(user !== null){
        if(user.password === password){
            const token = jwt.sign({
                uid: user._id,
                name: user.name,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
            }, config.jwt.secret);

            ctx.body = {
                success: true,
                uid: user._id,
                name: user.name,
                token: token
            };
        }else{
            ctx.throw(401, "密码错误");
        }
    }else{
        ctx.throw(401, "用户名错误");
    }
}