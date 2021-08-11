import { Router } from "express";
import * as rss from "../controllers/rss";
import * as search from "../controllers/search";
import * as suggestions from "../controllers/suggestions";

const router = Router();

router.get('/rss', rss.get);
router.get('/search', search.get);
router.get('/suggestions', suggestions.get);

export default router;