import { Router } from "express";
import * as rss from "../controllers/rss";
import * as search from "../controllers/search";
import * as suggestions from "../controllers/suggestions";
import * as files from "../controllers/files";
import multer from "multer";

const router = Router();
const upload = multer();

router.get('/rss', rss.get);
router.get('/search', search.get);
router.get('/suggestions', suggestions.get);
router.post('/files', upload.single('file'), files.post);

export default router;