import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { faker } from "@faker-js/faker";
import inflection from "inflection";
import Papa from "papaparse";
import { buildClientSchema, getIntrospectionQuery } from "graphql";

const gqlEndpoint = `${process.env.APP_URL ?? "http://sso-saml-local.mini.tailor.tech:8000"}/query`;

const fetchIntrospection = async () => {
  const rawResult = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  const { data } = await rawResult.json();
  return buildClientSchema(data);
};

const getSchemaByName = (schema, mutationName) => {
  const args = schema._mutationType._fields[mutationName].args.find(
    (a) => a.name === "input",
  );

  const fields = args.type._fields;
  return Object.keys(fields).reduce((acc, key) => {
    let fieldType = fields[key].type.name;
    if ("ofType" in fields[key].type) {
      fieldType = fields[key].type.ofType.name;
    }

    return {
      ...acc,
      [key]: fieldType,
    };
  }, {});
};

const schema = await fetchIntrospection();

export const readCSV = async (tableName) => {
  const __filename = fileURLToPath(import.meta.url);
  const absFilePath = path.resolve(
    path.dirname(__filename),
    `seed/mock/csv/${tableName}.csv`,
  );
  const fileContent = await fs.readFile(absFilePath, {
    encoding: "utf-8",
  });
  const parsedCSV = Papa.parse(fileContent.toString(), {
    header: true,
    skipEmptyLines: true,
  });

  const tableSchema = getSchemaByName(
    schema,
    `create${inflection.camelize(tableName)}`,
  );

  return parsedCSV.data.map((row) => {
    const nextRow = { ...row };

    if (!parsedCSV.meta.fields.includes("id")) {
      nextRow.id = faker.string.uuid();
    }

    Object.keys(row).forEach((key) => {
      if (row[key] === "") {
        delete nextRow[key];
        return;
      }

      switch (tableSchema[key]) {
        case "Boolean":
          nextRow[key] = row[key] === "TRUE";
          break;
        case "Int":
          nextRow[key] = parseInt(row[key], 10);
          break;
        case "Float":
          nextRow[key] = parseFloat(row[key]);
          break;
        case "ID":
          const value = row[key];
          if (value.includes(",")) {
            nextRow[key] = value.split(",").map((v) => v.trim());
          }
        default:
      }
    });

    return nextRow;
  });
};
