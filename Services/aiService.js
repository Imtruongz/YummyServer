import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_MODEL, RECIPE_GENERATION_PROMPT, COOKING_QA_PROMPT, RECIPE_SUGGESTION_USER_PROMPT } from '../Config/openaiConfig.js';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export const generateRecipeSuggestion = async (ingredients) => {
    try {
        const prompt = RECIPE_SUGGESTION_USER_PROMPT(ingredients);

        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: RECIPE_GENERATION_PROMPT
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 0.95
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating recipe:', error);
        throw error;
    }
};

export const answerCookingQuestion = async (question, conversationHistory = []) => {
    try {
        // Build messages array with conversation history
        const messages = [
            {
                role: "system",
                content: COOKING_QA_PROMPT
            },
            ...conversationHistory,
            { role: "user", content: question }
        ];

        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 0.95
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error answering cooking question:', error);
        throw error;
    }
};