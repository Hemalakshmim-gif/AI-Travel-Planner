import ai from "../services/geminiService.js";

export const testAI = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model:  process.env.GEMINI_MODEL,
      contents: "Say Hello from Gemini.",
    });

    res.json({
      success: true,
      response: response.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gemini API Error",
    });
  }
};