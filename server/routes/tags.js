import Router from 'koa-router';
import verify from '../middleware/verify.js';
import { createTag, getAllTags, modifyTag, deleteTag } from '../controllers/tags.js';

const router = new Router();

router.post("/tags",verify,createTag)
    .get("/tags",getAllTags)
    .patch("/tags/:id",verify,modifyTag)
    .delete("/tags/:id",verify,deleteTag);

export default router;