import express from 'express';
import { suggestRecipe, askCookingQuestion } from '../Controllers/aiController.js';

const router = express.Router();

// Recipe suggestion endpoint
router.post('/suggest-recipe', suggestRecipe);

// Cooking question endpoint
router.post('/ask-question', askCookingQuestion);

export default router;