import Router from 'koa-router';
import { initUser , login } from '../controllers/tokens.js';
const router = new Router();

//创建初始化用户
initUser();

router.post("/token", login);

export default router;