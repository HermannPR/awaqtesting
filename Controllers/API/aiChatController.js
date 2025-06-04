/**
 * Controlador para el chat de IA integrado en MAWI
 * Maneja las solicitudes de chat para el asistente de Biomo
 */

const fetch = require('node-fetch');
require('dotenv').config();

/**
 * Endpoint principal para el chat de IA
 * @param {*} req 
 * @param {*} res 
 */
async function aiChat(req, res) {
    try {
        const { messages, systemPrompt, model } = req.body;

        // Validar entrada
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                error: 'Messages array is required'
            });
        }

        // Configuración de IA desde variables de entorno
        const AI_CONFIG = {
            endpoint: process.env.AI_API_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions',
            apiKey: process.env.AI_API_KEY,
            model: process.env.AI_MODEL || 'llama3-8b-8192'
        };

        if (!AI_CONFIG.apiKey) {
            return res.status(500).json({
                success: false,
                error: 'AI API key not configured'
            });
        }

        // Preparar mensajes para la IA
        const aiMessages = [
            ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
            ...messages
        ];

        // Usar modelo específico si se proporciona
        const selectedModel = model || AI_CONFIG.model;

        // Llamar a la API de Groq
        const response = await fetch(AI_CONFIG.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AI_CONFIG.apiKey}`,
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: aiMessages,
                max_tokens: 1000,
                temperature: 0.7,
                stream: false
            })
        });

        // Verificar respuesta
        if (!response.ok) {
            const errorData = await response.text();
            console.error('AI API Error:', response.status, errorData);
            throw new Error(`Error de API de IA: ${response.status}`);
        }

        const data = await response.json();
        
        // Verificar que la respuesta tiene el formato esperado
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Formato de respuesta inválido de la API de IA');
        }

        // Enviar respuesta al frontend
        res.json({
            success: true,
            response: data.choices[0].message.content,
            model: selectedModel,
            usage: data.usage || null
        });

    } catch (error) {
        console.error('Error en aiChat:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor'
        });
    }
}

/**
 * Endpoint de configuración de IA
 * @param {*} req 
 * @param {*} res 
 */
function getAiConfig(req, res) {
    const AI_CONFIG = {
        model: process.env.AI_MODEL || 'llama3-8b-8192',
        endpoint: process.env.AI_API_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions',
        availableModels: [
            'llama3-8b-8192',
            'llama3-70b-8192',
            'mixtral-8x7b-32768',
            'gemma-7b-it'
        ]
    };

    res.json({
        success: true,
        config: {
            model: AI_CONFIG.model,
            endpoint: AI_CONFIG.endpoint.replace(process.env.AI_API_KEY || '', '***'),
            availableModels: AI_CONFIG.availableModels
        }
    });
}

module.exports = {
    aiChat,
    getAiConfig
};
