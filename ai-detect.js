// THIS BELOW CODE TAKEN FROM REPO `ai-referral` FOUND AT THE LINK BELOW. I DO NOT CLAIM AUTHORSHIP OR OWNERSHIP OF THE BELOW CONTENTS.
// https://github.com/SamyWeb91/ai-referral

/**
 * Detecta si una URL proviene de Copilot u otra IA conocida
 * @param {string} url - La URL completa
 * @returns {object} - Resultado con flags y fuente
 */
function detectAIReferral(url) {
  try {
    const parsed = new URL(url);
    const source = parsed.searchParams.get("utm_source");

    const aiSources = [
      "copilot.com",
      "chat.openai.com",
      "perplexity.ai",
      "gemini.google.com",
      "claude.ai"
    ];

    return {
      isAI: aiSources.includes(source),
      source: source || null
    };
  } catch (err) {
    return { isAI: false, source: null };
  }
}

module.exports = { detectAIReferral };
