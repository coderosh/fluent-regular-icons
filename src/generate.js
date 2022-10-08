const fs = require("fs");
const path = require("path");

const fg = require("fast-glob");
const fantasticon = require("fantasticon");

const FONT_NAME = "fluent-regular-icons";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

async function run() {
  let icons = await fg(path.join(__dirname, "icons", "*.svg"));
  icons = icons.map((icon) => path.parse(icon).name).sort(collator.compare);

  icons = new Set(icons);

  await fantasticon.generateFonts({
    inputDir: path.join(__dirname, "icons"),
    outputDir: path.join(__dirname, "../fonts"),
    name: FONT_NAME,
    fontTypes: [
      fantasticon.ASSET_TYPES.WOFF2,
      fantasticon.ASSET_TYPES.WOFF,
      fantasticon.ASSET_TYPES.TTF,
      fantasticon.ASSET_TYPES.SVG,
    ],
    assetTypes: [
      fantasticon.ASSET_TYPES.CSS,
      fantasticon.ASSET_TYPES.HTML,
      fantasticon.ASSET_TYPES.JSON,
    ],
    formatOptions: { json: { indent: 2 } },
    codepoints: getCodepoints(icons),
    fontHeight: 500,
    normalize: true,
  });
}

function getPrevCodePoints() {
  const prevcodepoint = path.join(__dirname, "../fonts", FONT_NAME + ".json");
  if (fs.existsSync(prevcodepoint)) return require(prevcodepoint);
  return null;
}

// first icons are sorted in ascending order
// if new icons are added
// make sure previous codepoints are similar
// and assign the new icon last slot
function getCodepoints(icons) {
  const prev = getPrevCodePoints();
  if (!prev) {
    return generateNewCodePoints(icons);
  }

  const iconsAdded = Object.keys(prev).length < icons.length;

  if (iconsAdded) {
    let newCode = Math.max(...Object.values(prev));

    for (const icon of icons) {
      if (!prev[icon]) {
        // as the codes assigned by `generateNewCodePoints` are from start of private use area 0xe000 (57344) without any gaps
        // next icon will go in next empty slot ( which is just 1 greater than max code )
        newCode++;
        prev[icon] = newCode;
      }
    }
  }

  return prev;
}

function generateNewCodePoints(icons) {
  let codepoints = {};
  icons = Array.from(icons);

  Array.from(icons).forEach((icon, i) => {
    codepoints[icon] = 0xe000 + i;
  });

  return codepoints;
}

run();
