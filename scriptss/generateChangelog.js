const fs = require("fs");
const fetch = global.fetch || require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const { TRELLO_KEY, TRELLO_TOKEN, BOARD_ID, TRELLO_API } = process.env;

if (!TRELLO_KEY || !TRELLO_TOKEN || !BOARD_ID) {
  console.error("Missing TRELLO_KEY, TRELLO_TOKEN, or BOARD_ID in .env");
  process.exit(1);
}

const baseUrl = TRELLO_API || "https://api.trello.com/1";

const typeLabels = ["Feat", "Fix", "Refactor"];
const projectMap = {
  Site: { title: "سایت", color: "green" },
  Admin: { title: "پنل ادمین", color: "blue" },
  Backend: { title: "بک اند", color: "green" },
  B2B: { title: "B2B", color: "purple" },
};

const get = async (path) => {
  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("key", TRELLO_KEY);
  url.searchParams.set("token", TRELLO_TOKEN);
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Trello API error ${response.status}: ${text}`);
  }
  return response.json();
};

const getRCList = async () => {
  const lists = await get(`/boards/${BOARD_ID}/lists`);
  const findRC = lists.find((item) => item.name === "RC");
  if (!findRC) {
    throw new Error("List 'RC' not found on the board.");
  }
  await getCards(findRC.id);
};

const getCards = async (listId) => {
  const cards = await get(`/lists/${listId}/cards`);
  groupCards(cards);
};

const getType = (labels) => {
  if (labels.includes("Fix")) return "fix";
  if (labels.includes("Feat")) return "feat";
  return "refactor";
};

const groupCards = (cards) => {
  let result = {};
  for (const card of cards) {
    const labels = card.labels.map((l) => l.name);
    const projectLabel = labels.find((l) => projectMap[l]);

    if (!projectLabel) continue;

    const project = projectMap[projectLabel];
    if (!result[project.title]) {
      result[project.title] = {
        project: project.title,
        color: project.color,
        feat: {},
        fix: {},
        refactor: {},
      };
    }

    const type = getType(labels);
    const sectionLabel = labels.find(
      (l) => !projectMap[l] && !typeLabels.includes(l)
    );

    const section = sectionLabel || "عمومی";

    if (!result[project.title][type][section]) {
      result[project.title][type][section] = [];
    }

    result[project.title][type][section].push(card.name);
  }
  buildOutput(result);
};

const buildOutput = (grouped) => {
  const releaseDate = process.argv[2] || "unknown-date";
  const safeReleaseDate = releaseDate.replace(/[\\\/]/g, "-");
  const output = {
    releaseDate,
    changes: Object.values(grouped).map((project) => ({
      project: project.project,
      color: project.color,
      categories: [
        {
          category: { title: "ویژگی‌های جدید", icon: "✅" },
          items: Object.entries(project.feat).map(([title, descriptions]) => ({
            title,
            descriptions,
          })),
        },
        {
          category: { title: "رفع اشکالات", icon: "🔧" },
          items: Object.entries(project.fix).map(([title, descriptions]) => ({
            title,
            descriptions,
          })),
        },
        {
          category: { title: "رفکتور", icon: "🧩" },
          items: Object.entries(project.refactor).map(
            ([title, descriptions]) => ({
              title,
              descriptions,
            })
          ),
        },
      ],
    })),
  };

  fs.writeFileSync(
    `./changelog-${safeReleaseDate}.json`,
    JSON.stringify(output, null, 2)
  );
};
getRCList().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
