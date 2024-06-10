import { join } from 'path';
import { promises } from 'fs';
import { table } from 'console';
import { uuidv7 } from 'uuidv7';

/** 
 * @class TestContext: holds the created data. It is automatically fetched before and after each test.
 * And it is automatically deleted after all tests are run.
 * 
 * To access the data
 * - context.env.TableName.EntityName
 * To add data to the context (this will automatically delete the data after the test is run)
 * - context.addToEnv(tableName, entityName, values)
 * Useful functions
 * - await context.deleteData() to delete all data
 * - await context.loadData(data) resets the env and load data from a data object
 * - await context.fetchData() fetches the data from the database
 * 
 * @author Daniel Alvarez
 */
export default class TestContext {
    /** @typedef {import('./queryHelper.mjs').default} QueryHelper */
    /** @type {QueryHelper} */
    #queryHelper;
    #savedIds;

    constructor(queryHelper) {
        this.env = {};
        this.#queryHelper = queryHelper;
        this.#savedIds = {};
    }
    /**
     * This function loads test data into the environment from the data object
     * @param {object} data 
     */
    async loadData(dataFolderPath) {

        async function findJSONDataFiles(dir) {
            const entries = await promises.readdir(dir, { withFileTypes: true });
            const files = [];

            for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
                const fullPath = join(dir, entry.name);
                if (entry.isDirectory()) {
                    files.push(...await findJSONDataFiles(fullPath));
                } else if (entry.name.endsWith('.json')) {
                    const file = await promises.readFile(fullPath, 'utf8').then(JSON.parse);
                    files.push(file);
                }
            }

            return files;
        }

        const jsonFiles = await findJSONDataFiles(dataFolderPath);
        const data = jsonFiles.reduce((acc, file) => ({ ...acc, ...file }), {});

        const sortedTables = this.#topologicalSort(Object.keys(data)).reverse();

        // Function that maps UUIDs to IDs or creates the entity if it doesn't exist
        function convertFieldToUUID(fieldValue, savedIds) {
            if (!fieldValue) return fieldValue;

            if (Array.isArray(fieldValue)) return fieldValue.map((value) => convertFieldToUUID(value, savedIds));

            if (typeof fieldValue === "object") {
                if (fieldValue.UUID) {
                    if (savedIds[fieldValue.UUID]) return savedIds[fieldValue.UUID];

                    savedIds[fieldValue.UUID] = uuidv7();
                    return savedIds[fieldValue.UUID];
                }

                return Object.fromEntries(
                    Object.entries(fieldValue).map(([key, value]) => [
                        key,
                        convertFieldToUUID(value, savedIds),
                    ])
                );
            }

            return fieldValue;
        }

        function assignUUIDToValues(values, savedIds) {
            const mappedValues = {};
            for (const [key, value] of Object.entries(values)) {
                mappedValues[key] = convertFieldToUUID(value, savedIds);
            }
            return mappedValues;
        }

        for (const tableName of sortedTables) {
            if (!data[tableName]) throw new Error(`Table ${tableName} not found in test data`);
            for (const [entityName, values] of Object.entries(data[tableName])) {
                if (!this.env[tableName]) this.env[tableName] = {};

                if (this.#savedIds[`${tableName}.${entityName}`]) {
                    values.id = this.#savedIds[`${tableName}.${entityName}`];
                }

                // Map UUIDs to IDs
                const mappedValues = assignUUIDToValues(values, this.#savedIds)

                const result = await this.#queryHelper.create(tableName, mappedValues);
                this.env[tableName][entityName] = result;

                if (!this.#savedIds[`${tableName}.${entityName}`]) {
                    this.#savedIds[`${tableName}.${entityName}`] = result.id;
                }
            }
        }

        console.info(`Test data loaded! ${sortedTables.map((tableName) => Object.keys(data[tableName]).length).reduce((acc, val) => acc + val, 0)} records loaded`);
    }

    /**
     * This function deletes all the data in the environment
     */
    async deleteData() {
        const sortedTables = this.#topologicalSort(Object.keys(this.env));
        for (const tableName of sortedTables) {
            for (const [_entityName, entity] of Object.entries(this.env[tableName])) {
                const response = await this.#queryHelper.delete(tableName, entity.id);
                if (response.errors) {
                    console.error(response.errors);
                }
            }
        }
        console.info(`Test data deleted! ${sortedTables.map((tableName) => Object.keys(this.env[tableName]).length).reduce((acc, val) => acc + val, 0)} records deleted`);
    }
    /**
     * This function fetches all the data in the environment and updates the environment
     */
    async fetchData() {
        for (const [tableName, entities] of Object.entries(this.env)) {
            for (const [entityName, values] of Object.entries(entities)) {
                const result = await this.#queryHelper.fetch(tableName, values.id);
                Object.assign(this.env[tableName][entityName], result);
            }
        }
    }

    /**
     * This function adds data to the environment. This will be automatically deleted after all tests are run.
     * @param {string} tableName
     * @param {string} entityName
     * @param {object} values
     * @returns
    */
    addToEnv(tableName, entityName, values) {
        if (!this.env[tableName]) {
            this.env[tableName] = {};
        }
        this.env[tableName][entityName] = values;
    }

    #topologicalSort(tablesSubset) {
        const queryFields = this.#queryHelper.queryFields;
        const dependencies = {};
        const queue = [];
        const sorted = [];
        const visited = new Set(); // Track visited nodes

        // Initialize dependencies
        for (const tableName of tablesSubset) {
            dependencies[tableName] = 0;
        }

        // Count dependencies
        for (const tableName of tablesSubset) {
            for (const field of queryFields[tableName]) {
                if (field.type && field.type !== tableName && field.type in dependencies) {
                    dependencies[field.type]++;
                }
            }
        }

        // Add tables without dependencies to the queue
        for (const tableName of tablesSubset) {
            if (dependencies[tableName] === 0) {
                queue.push(tableName);
            }
        }

        // Process the queue
        while (queue.length > 0) {
            const tableName = queue.shift();
            sorted.push(tableName);
            visited.add(tableName); // Mark as visited

            // Update dependencies and add to queue if resolved
            for (const field of queryFields[tableName]) {
                if (field.type && !visited.has(field.type)) { // Check for cycles
                    dependencies[field.type]--;
                    if (dependencies[field.type] === 0) {
                        queue.push(field.type);
                    }
                }
            }
        }

        // Check for cycles: If not all tables are sorted, there's a cycle
        if (sorted.length < tablesSubset.length) {
            const cycleTables = tablesSubset.filter(table => !sorted.includes(table));
            throw new Error(`Cycle detected among tables: ${cycleTables.join(', ')}`);
        }

        return sorted;
    }

    // ================== TailorDB Helper Functions ==================

    /**
     * This method creates a record in a table
     * @param {string} tableName name of the table to create a record in
     * @param {object} variables the variables to create the record with
     * @returns the record created
     * @throws an error if the record already exists
    */
    async create(tableName, variables) {
        const response = await this.#queryHelper.create(tableName, variables);
        return response;
    }

    /**
     * (FETCHES DATA AUTOMATICALLY)
     * This method updates a record in a table
     * @param {string} tableName name of the table to update
     * @param {UUID} id id of the record to update
     * @param {object} variables the variables to update the record with
     * @returns the record updated
    */
    async update(tableName, id, variables) {
        const response = await this.#queryHelper.update(tableName, id, variables);
        await this.fetchData();
        return response;
    }

    /**
     * This method deletes a record in a table
     * @param {string} tableName name of the table to delete
     * @param {UUID} id id of the record to delete 
     * @returns 
     */
    async delete(tableName, id) {
        const response = await this.#queryHelper.delete(tableName, id);
        return response;
    }

    /**
     * This method fetches all records from a table
     * @param {string} tableName the name of the table to fetch from
     * @param {object?} filterObject A javascript object that represents a TailorDB filter
     * @returns {object[]} an array of records fetched
     */
    async fetchAll(tableName, filterObject = {}) {
        const response = await this.#queryHelper.fetchAll(tableName, filterObject);
        return response;
    }

    /**
     * This method fetches a single record from a table based on the id
     * @param {string} tableName the name of the table to fetch from
     * @param {UUID} id the id of the record to fetch
     * @returns data of the record fetched
     */
    async fetch(tableName, id) {
        const response = await this.#queryHelper.fetch(tableName, id);
        return response;
    }

    /**
     * (FETCHES DATA AUTOMATICALLY)
     * This method runs a query or mutation based on the pipeline name and variables passed
     * @param {string} pipelineName the name of the query or mutation to run
     * @param {object} variables the variables to pass to the query or mutation
     * @returns data returned from the query or mutation
     */
    async runPipeline(pipelineName, variables = {}) {
        const response = await this.#queryHelper.runPipeline(pipelineName, variables);
        await this.fetchData();
        return response;
    }

}