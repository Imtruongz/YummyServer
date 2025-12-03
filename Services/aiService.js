import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_MODEL } from '../Config/openaiConfig.js';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export const generateRecipeSuggestion = async (ingredients) => {
    try {
        const prompt = `Given these ingredients: ${ingredients.join(', ')}, suggest a recipe that can be made. Include:
        1. Recipe name
        2. Additional ingredients needed (if any)
        3. Step by step cooking instructions
        4. Estimated cooking time
        5. Difficulty level`;
        
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                { 
                    role: "system", 
                    content: "You are a professional chef assistant, expert in creating recipes and providing cooking guidance." 
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating recipe:', error);
        throw error;
    }
};

export const answerCookingQuestion = async (question) => {
    try {
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                { 
                    role: "system", 
                    content: "You are a professional chef assistant, expert in cooking techniques and food knowledge." 
                },
                { role: "user", content: question }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error answering cooking question:', error);
        throw error;
    }
};