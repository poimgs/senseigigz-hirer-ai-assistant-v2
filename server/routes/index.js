import express from 'express';
import { improveRoute } from './improveRoute.js';
import { convertTextToGig } from './convertRoute.js';
import { validateImproveRequest, validateConvertRequest } from '../middleware/validation.js';

const router = express.Router();

router.post('/improve', validateImproveRequest, improveRoute);
router.post('/convert-text-to-gig', validateConvertRequest, convertTextToGig);

export default router;
