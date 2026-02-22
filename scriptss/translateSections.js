const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Get the path to the translations.json file
const translationsPath = path.join(__dirname, "translations.json");

function loadTranslations() {
  // if that file does not exist create it and return an empty object
  if (!fs.existsSync(translationsPath)) {
    fs.writeFileSync(translationsPath, JSON.stringify({}));
  }
  // if it does exist, parse the file and return the object
  return JSON.parse(fs.readFileSync(translationsPath, "utf8"));
}

function saveTranslations(data) {
  // write the data to the file
  // null is replacer, 2 is space
  fs.writeFileSync(translationsPath, JSON.stringify(data, null, 2));
}

dotenv.config();

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function translateWithGemini(titles, targetLang) {
  console.log("🤖 Starting translation with Gemini...");
  const prompt = `
  Translate these titles to ${targetLang}.
  They are a titles of software changelog that used in a online store with their Admin Panel.
  Return only valid JSON object.
  Example: {
  "shipping methods": "روش‌های ارسال"
  }
  Titles: 
  ${titles.map((t) => `- ${t}`).join("\n")}
    `;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [prompt],
  });

  const responseText =
    typeof response.text === "function" ? await response.text() : response.text;

  return responseText.trim();
}

function extractJsonObject(text) {
  // Remove common code fences if present, then take the first JSON object block.
  const cleaned = text.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in AI response");
  }
  return cleaned.slice(start, end + 1);
}

async function translateMissingSections(sectionTitles) {
  const translations = loadTranslations();

  const missing = sectionTitles.filter((title) => !translations[title]);

  if (missing.length === 0) {
    console.log("✅ No missing sections");
    return translations;
  }

  const targetLang = process.argv[3] || "fa"; 
  
  console.log(`🌍 Translating to ${targetLang}:`, missing);

  const translated = await translateWithGemini(missing, targetLang);

  try {
    const jsonText = extractJsonObject(translated);
    const newTranslations = JSON.parse(jsonText);
    const updated = { ...translations, ...newTranslations };
    saveTranslations(updated);
    console.log("✅ Translations saved");
    return updated;
  } catch (error) {
    console.error("❌ Failed to parse AI response");
    throw error;
  }
}

module.exports = translateMissingSections;
