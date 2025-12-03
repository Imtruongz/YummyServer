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

export const answerCookingQuestion = async (question, conversationHistory = []) => {
    try {
        // Build messages array with conversation history
        const messages = [
            { 
                role: "system", 
                content: "You are a professional chef assistant, expert in cooking techniques and food knowledge. Use the conversation history to understand the context of follow-up questions." 
            },
            ...conversationHistory,
            { role: "user", content: question }
        ];

        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error answering cooking question:', error);
        throw error;
    }
};