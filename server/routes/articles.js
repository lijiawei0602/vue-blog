import Router from 'koa-router';
import verify from '../middleware/verify.js';
import { getAllArticles , createArticle , modifyArticle , getArticle , deleteArticle , getAllPublishArticles } from '../controllers/articles.js';

const router = new Router();

router.get("/articles", verify, getAllArticles)
    .post("/articles", verify, createArticle)
    .get("/articles/:id", getArticle)
    .patch("/articles/:id",verify, modifyArticle)
    .delete("/articles/:id",verify, deleteArticle)
    .get("/publishArticles", getAllPublishArticles);

export default router;
