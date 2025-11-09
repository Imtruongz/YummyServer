import { generateRecipeSuggestion, answerCookingQuestion } from '../Services/aiService.js';

export const suggestRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;
        
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide a valid array of ingredients' 
            });
        }

        const suggestion = await generateRecipeSuggestion(ingredients);
        res.json({ success: true, suggestion });
    } catch (error) {
        console.error('Error in suggestRecipe:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate recipe suggestion' 
        });
    }
};

export const askCookingQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide a valid question' 
            });
        }

        const answer = await answerCookingQuestion(question);
        res.json({ success: true, answer });
    } catch (error) {
        console.error('Error in askCookingQuestion:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get answer' 
        });
    }
};