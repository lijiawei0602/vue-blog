import fs from 'fs';

let config = {
    app : {
        port : process.env.port || 8086,
        base : '/api'
    },
    mongodb : {
        url : "mongodb://localhost:27017/blog"
    },
    mongodbSecret : {
        user : '',
        pass : ''
    },
    jwt : {
        secret : 'me'
    },
    admin : { 
        user : 'admin',
        password : '123456'
    }
};

if(fs.existsSync(__dirname + "/private.js")){
    config = Object.assign(config , require("./private.js"));
}

export default config;