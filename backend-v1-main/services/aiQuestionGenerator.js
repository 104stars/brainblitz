const axios = require('axios');

class AIQuestionGenerator {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || '';
    this.openAiApiKey = process.env.OPENAI_API_KEY || '';
    this.groqURL = 'https://api.groq.com/openai/v1/chat/completions';
    this.openAiURL = 'https://api.openai.com/v1/chat/completions';
    this.groqModel = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
    this.openAiModel = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Realiza la llamada a la API de IA, maneja la autenticación y la estructura de la petición.
   * @private
   */
  async _callApi(url, model, apiKey, prompt) {
    try {
      const response = await axios.post(url, {
        model: model,
        messages: [
          { role: 'system', content: 'Eres un experto en crear preguntas de trivia educativas y entretenidas. Responde siempre en formato JSON válido.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices?.[0]?.message?.content || '';
      const parsed = this.extractJson(content);
      return (parsed && Array.isArray(parsed.questions)) ? parsed.questions : [];
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      // En lugar de lanzar el error, lo registramos y devolvemos un array vacío
      // para que la lógica de fallback pueda continuar.
      console.warn(`Advertencia: Falló la llamada a ${url}. Razón: ${errorMessage}`);
      return [];
    }
  }

  /**
   * Genera preguntas de trivia, intentando primero con Groq y usando OpenAI como respaldo.
   */
  async generateQuestions(topic, difficulty = 'medium', count = 5) {
    if (!this.groqApiKey && !this.openAiApiKey) {
      throw new Error('No se encontró ninguna API key de IA. Por favor configura GROQ_API_KEY o OPENAI_API_KEY en tu archivo .env.');
    }

    const prompt = this.buildPrompt(topic, difficulty, count);
    let questions = [];

    // 1. Intentar con Groq
    if (this.groqApiKey) {
      questions = await this._callApi(this.groqURL, this.groqModel, this.groqApiKey, prompt);
    }

    // 2. Si Groq falló o no devolvió preguntas, intentar con OpenAI como respaldo
    if (questions.length === 0 && this.openAiApiKey) {
      questions = await this._callApi(this.openAiURL, this.openAiModel, this.openAiApiKey, prompt);
    }

    // 3. Procesar y validar las preguntas obtenidas
    if (questions.length === 0) {
      throw new Error('La IA no devolvió preguntas válidas. Verifica tu API key y conexión.');
    }

    // Filtrar preguntas repetidas usando un Map para mantener el orden de inserción
    const uniqueQuestionsMap = new Map();
    for (const q of questions) {
      const key = q.text?.trim().toLowerCase();
      if (key && !uniqueQuestionsMap.has(key)) {
        uniqueQuestionsMap.set(key, q);
      }
    }
    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());

    if (uniqueQuestions.length < count) {
      throw new Error('La IA no generó suficientes preguntas únicas.');
    }

    return { questions: uniqueQuestions.slice(0, count) };
  }

  // --- MÉTODOS AUXILIARES (sin cambios) ---

  extractJson(content) {
    if (!content) return null;
    let cleaned = content.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    if (!(cleaned.startsWith('{') && cleaned.endsWith('}'))) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1);
      }
    }
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      return null;
    }
  }

  buildPrompt(topic, difficulty, count) {
    return `Genera ${count} preguntas de trivia sobre el tema "${topic}" con dificultad ${difficulty}.\n\nFormato requerido (JSON válido):\n{\n  "questions": [\n    {\n      "id": "unique_id",\n      "text": "Pregunta aquí",\n      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],\n      "correctAnswerIndex": 0,\n      "category": "${topic}",\n      "difficulty": "${difficulty}",\n      "explanation": "Explicación de la respuesta correcta"\n    }\n  ]\n}\n\nRequisitos:\n- Preguntas interesantes y educativas\n- 4 opciones de respuesta\n- Explicación clara de la respuesta correcta\n- Dificultad apropiada para el nivel ${difficulty}\n- Tema: ${topic}\n\nResponde solo con el JSON, sin texto adicional.`;
  }

  // --- MÉTODOS DE FALLBACK Y UTILIDADES (sin cambios) ---
  
  async generateQuestionsFree(topic, difficulty = 'medium', count = 5) {
    throw new Error('No se pueden generar preguntas con IA.');
  }

  getFallbackQuestions(topic, difficulty, count) {
    throw new Error('No se pueden generar preguntas de respaldo.');
  }
  
  getAvailableTopics() {
    return ['Ciencia', 'Historia', 'Geografía', 'Tecnología', 'Deportes', 'Arte', 'Literatura', 'Matemáticas', 'Biología', 'Química', 'Física', 'Astronomía', 'Música', 'Cine', 'Videojuegos'];
  }

  getDifficultyLevels() {
    return [{ value: 'easy', label: 'Fácil' }, { value: 'medium', label: 'Medio' }, { value: 'hard', label: 'Difícil' }];
  }
}

module.exports = AIQuestionGenerator;