import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateImportAndExportStatements = (file: string) => {
  const nameWithoutExtension = path.basename(file, path.extname(file));
  const validJSName = nameWithoutExtension.replace(/-|\./g, "_");
  const camelCaseName = validJSName.replace(/_\w/g, (match) =>
    match[1].toUpperCase(),
  );

  return {
    importStatement: `import ${validJSName} from "./${nameWithoutExtension}.json";`,
    exportStatement: `export const ${camelCaseName} = mapJsonToProps(${validJSName});`,
  };
};

const generateStorybookTypes = async () => {
  try {
    const directoryPath = path.join(__dirname, "../src/ark-types/");
    const files = fs.readdirSync(directoryPath);

    const statements = files
      .filter((file) => path.extname(file) === ".json")
      .map(generateImportAndExportStatements);

    const importStatements = statements.map((s) => s.importStatement);
    const exportStatements = statements.map((s) => s.exportStatement);

    const finalContent = `import { mapJsonToProps } from "../utils/ark-props";\n\n${importStatements.join(
      "\n",
    )}\n\n${exportStatements.join("\n")}`;

    fs.writeFileSync(
      path.join(__dirname, "../src/ark-types/index.ts"),
      finalContent,
    );
  } catch (err) {
    console.log("Unable to scan directory:", err);
  }
};

generateStorybookTypes().then(() => console.log("completed!")).catch(console.error);
