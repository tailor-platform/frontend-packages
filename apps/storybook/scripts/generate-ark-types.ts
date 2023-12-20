import * as fs from "fs";
import * as path from "path";

/**
 * Generates Type Definition Files for Ark components
 *
 * - `components`: List of UI components.
 * - `generateArkTypeFiles`: Fetches and writes type definitions to `./src/ark-types`.
 *
 * Update the `components` array when:
 * - Adding new components.
 * - Removing or renaming existing components.
 */

const components = [
  "accordion",
  "avatar",
  "carousel",
  "checkbox",
  "date-picker",
  "dialog",
  "hover-card",
  "menu",
  "number-input",
  "pagination",
  "pin-input",
  "popover",
  "radio-group",
  "range-slider",
  "select",
  "slider",
  "segment-group",
  "switch",
  "tabs",
  "tags-input",
  "toast",
  "tooltip",
];

const generateArkTypeFiles = async () => {
  const dir = "./src/ark-types";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const promises = components.map(async (component) => {
    const url = `https://raw.githubusercontent.com/chakra-ui/ark/main/packages/website/src/content/types/react/${component}.types.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.json();

    fs.writeFileSync(
      path.join(dir, `${component}.types.json`),
      JSON.stringify(data, null, 2),
    );
  });

  return Promise.all(promises).catch(console.error);
};

generateArkTypeFiles();
