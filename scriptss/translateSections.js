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

async function translateWithGemini(text, targetLang) {
  const prompt = `
  Translate these titles to ${targetLang}.
  They are a titles of software changelog that used in a online store with their Admin Panel.
  Titles: "${text}"
  Return ONLY the translated titles.
    `;

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [prompt],
  });

  return response.text.trim();
}

async function translateMissingSections(sectionTitles) {
  const translations = loadTranslations();

  const missing = sectionTitles.filter((title) => !translations[title]);

  if (missing.length === 0) {
    console.log("✅ No missing sections");
    return translations;
  }

  const targetLang = process.argv[3] || "fa"; // default Persian
  console.log(`🌍 Translating to ${targetLang}:`, missing);

  for (const title of missing) {
    try {
      const translated = await translateWithGemini(title, targetLang);
      translations[title] = translated;
      console.log(`✔ ${title} → ${translated}`);
    } catch (err) {
      console.error(`❌ Failed to translate ${title}:`, err.message);
    }
  }

  saveTranslations(translations);
  return translations;
}

module.exports = translateMissingSections;
