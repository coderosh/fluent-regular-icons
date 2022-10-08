const fs = require("fs");

const customIcons = [
  "battery_charging_0",
  "battery_charging_1",
  "battery_charging_2",
  "battery_charging_3",
  "battery_charging_4",
  "battery_charging_5",
  "battery_charging_6",
  "battery_charging_7",
  "battery_charging_8",
  "battery_charging_9",
  "battery_charging_10",

  "diamond-active",
];

const table = `
<!-- CUSTOM ICONS START -->

| Name | Icon |
| --- | --- |
${customIcons
  .map((icon) => {
    return `| ${icon} | ![${icon}](./icons/${icon}.svg) |`;
  })
  .join("\n")}

<!-- CUSTOM ICONS END -->
`;

let readme = fs.readFileSync("README.md", "utf-8");

readme = readme.replace(
  /<!-- CUSTOM ICONS START -->(.*?)<!-- CUSTOM ICONS END -->/gs,
  table
);

fs.writeFileSync("README.md", readme);
