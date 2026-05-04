const express = require("express");
const cors = require("cors");
const generateChangelog = require("./scripts/generateChangelog");

const app = express();
app.use(cors());
const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/changelog", async (req, res) => {
  try {
    const date = req.query.date;
    const lang = req.query.lang;

    if (!date) {
      res.status(400).json({
        ok: false,
        message: "date is required",
      });
    }

    const result = await generateChangelog(date, lang);
    res.status(200).json({
      data: result,
      message: "The Change log made sussesfully",
    });
  } catch (error) {
    console.error("fgfgf", error);

    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
