import pkg from '@apollo/client';
import pluralize from 'pluralize';

const { ApolloClient, HttpLink, gql, InMemoryCache } = pkg;

/**
 *  @class QueryHelper is a helper object that has the following functions
 * - await create(tableName, variables) creates a new entity
 * - await update(tableName, id, variables) updates an entity
 * - await delete(tableName, id) deletes an entity
 * - await get(tableName, id) gets an entity
 * - await getAll(tableName) gets all entities of a table
 * - await runPipeline(pipelineName, variables?) runs any mutation or query 
 *  @author Daniel Alvarez
*/
export default class QueryHelper {
    constructor(appURL, accessToken) {
        this.client = new ApolloClient({
            link: new HttpLink({
                uri: `${appURL}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                },
                query: {
                    fetchPolicy: 'no-cache',
                },
            },
        });
        this.queryFields = {};
        this.pipelineArgs = {};
        this.accessToken = accessToken;
        this.appURL = appURL;
    }

    /**
     * This method loads the query fields and pipeline arguments from the app
     * @returns
    */
    async loadQueryFields() {
        const result = await fetch(this.appURL, {
            method: 'POST',

            headers: {
                "Content-Type": "application/json",
                "Auhorization": "Bearer " + this.accessToken,
            },

            body: JSON.stringify({
                query: `{
                    __schema {
                        types {
                            kind
                            name
                            description
                            fields(includeDeprecated: true) {
                                name
                                description
                                args {
                                    name
                                    description
                                    type {
                                        name
                                        kind
                                        ofType {
                                            name
                                            kind
                                        }
                                    }
                                    defaultValue
                                }
                                type {
                                    kind
                                    name
                                    ofType {
                                        kind
                                        name
                                        ofType {
                                            kind
                                            name
                                            ofType {
                                                kind
                                                name
                                                ofType {
                                                    kind
                                                    name
                                                    ofType {
                                                        kind
                                                        name
                                                        ofType {
                                                            kind
                                                            name
                                                            ofType {
                                                                kind
                                                                name
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                isDeprecated
                                deprecationReason
                            }
                        }
                    }
                }`
            })
        })

        const resultJson = await result.json();

        // Construct mutations and queries with their arguments
        this.pipelineArgs = resultJson.data.__schema.types
            .filter((type) => type.name == "Query" || type.name == "Mutation")
            .reduce((acc, type) => ({
                ...acc,
                [type.name]: type.fields.reduce((acc, field) => ({
                    ...acc,
                    [field.name]: {
                        "input": field.args.map((arg) => {
                            let nestedFieldType = arg.type;
                            let isArray = false;
                            let isRequired = false;
                            while (nestedFieldType.ofType) {
                                if (nestedFieldType.kind == "NON_NULL")
                                    isRequired = true;
                                if (nestedFieldType.kind == "LIST")
                                    isArray = true;
                                nestedFieldType = nestedFieldType.ofType;
                            }

                            let formattedArgType = nestedFieldType.name;
                            if (isArray) {
                                formattedArgType = `[${formattedArgType}]`;
                            }
                            if (isRequired) {
                                formattedArgType = `${formattedArgType}!`;
                            }
                            return {
                                "name": arg.name,
                                "type": formattedArgType,
                                "isRequired": isRequired,
                                "isArray": isArray,
                            }
                        }),
                        "output": field.type?.kind == "OBJECT" ? field.type.name : null,
                    }
                }), {})
            }), {});


        // Construct query fields for each table
        this.queryFields = resultJson.data.__schema.types
            .filter((type) => type.fields && type.fields.length > 0)
            .reduce((acc, type) => ({
                ...acc,
                [type.name]: type.fields.map((field) => {
                    let nestedFieldType = field.type;
                    while (nestedFieldType.ofType) {
                        nestedFieldType = nestedFieldType.ofType;
                    }

                    let nestedFieldTypeName = null;
                    if (nestedFieldType.kind == "OBJECT")
                        nestedFieldTypeName = nestedFieldType.name;

                    return {
                        name: field.name,
                        type: nestedFieldTypeName,
                    };
                }),
            }));
        return this.queryFields;
    }

    /**
     * This method constructs a GQL response based on the fields of a table
     * @param {string} tableName the name of the table to construct the response for
     * @param {number} depth the depth of the response
     * @returns the constructed GQL response
    */
    constructGQLResonse(tableName, depth = 3) {
        const fields = [];

        function traverseFields(name, currentDepth, queryFields, maxDepth) {
            const tableFields = queryFields[name];
            if (!tableFields) return; // Handle cases where the table doesn't exist

            const tabs = Array(currentDepth).fill("\t").join("");

            for (const field of tableFields) {
                if (field.type && currentDepth + 1 > maxDepth) {
                    continue;
                }
                if (field.type) { // Nested field
                    fields.push(`${tabs}${field.name} {`);
                    traverseFields(field.type, currentDepth + 1, queryFields, depth);
                    fields.push(`${tabs}}`);
                }
                else{
                    fields.push(`${tabs}${field.name}`);
                }
            }
        }

        traverseFields(tableName, 1, this.queryFields, depth); // Start traversal

        return `{\n\t${fields.join("\n\t")}\n\t}`;
    }

    /**
 * This method constructs a creation gql query based on the table name
 * @param {string} tableName the name of the table to create a record in
 */
    constructCreateQuery(tableName) {
        if (!this.pipelineArgs["Mutation"][`create${tableName}`]) 
            throw new Error(`create${tableName} not found in the database`);

        const query = `mutation ($input: ${tableName}CreateInput!) {
    create${tableName} (input: $input) ${this.constructGQLResonse(tableName)}
}`;
        return query;
    }

    // do the same for update, delete and fetch:

    /**
     * This method constructs an update gql query based on the table name
     * @param {string} tableName the name of the table to update a record in
    */
    constructUpdateQuery(tableName) {
        if (!this.pipelineArgs["Mutation"][`update${tableName}`]) 
            throw new Error(`update${tableName} not found in the database`);
        
        const query = `mutation ($id: ID!, $input: ${tableName}UpdateInput!) {
    update${tableName} (id: $id, input: $input) ${this.constructGQLResonse(tableName)}
}`;
        return query;
    }

    /**
     * This method constructs a delete gql query based on the table name
     * @param {string} tableName the name of the table to delete a record in
     * @returns the delete query
    */
    constructDeleteQuery(tableName) {
        if (!this.pipelineArgs["Mutation"][`delete${tableName}`]) 
            throw new Error(`delete${tableName} not found in the database`);

        const query = `mutation ($id: ID!) {
    delete${tableName} (id: $id)
}`;
        return query;
    }

    /**
     * This method constructs a fetch gql query based on the table name
     * @param {string} tableName the name of the table to fetch a record from
     * @returns the fetch query
    */
    constructFetchQuery(tableName) {
        const lowerCaseTableName = tableName.charAt(0).toLowerCase() + tableName.slice(1);

        if (!this.pipelineArgs["Query"][lowerCaseTableName]) 
            throw new Error(`${lowerCaseTableName} query not found in the database`);

        const query = `query ($id: ID!) {
    ${lowerCaseTableName} (id: $id) ${this.constructGQLResonse(tableName)}
}`;
        return query;
    }

    /**
     * This method constructs a fetch all gql query based on the table name
     * @param {string} tableName the name of the table to fetch all records from
     * @returns the fetch all query
    */
    constructFetchAllQuery(tableName) {
        const pluralTableName = pluralize(tableName.charAt(0).toLowerCase() + tableName.slice(1));
        
        if (!this.pipelineArgs["Query"][pluralTableName])
            throw new Error(`${pluralTableName} query not found in the database`);

        const query = `query {
    ${pluralTableName} {
        collection ${this.constructGQLResonse(tableName)}
    }
}`;
        return query;
    }

    /**
     * This method creates a record in a table
     * @param {string} tableName name of the table to create a record in
     * @param {object} variables the variables to create the record with
     * @returns the record created
     * @throws an error if the record already exists
    */
    async create(tableName, variables) {
        const query = gql`
            mutation ($input: ${tableName}CreateInput!) {
                create${tableName} (input: $input) ${this.constructGQLResonse(tableName)}
            }
        `;

        const result = await this.client
            .mutate({
                mutation: query,
                variables: {
                    input: variables,
                },
            })
            .catch((e) => {
                if (e.message.includes("already exists")) {
                    console.error(
                        "\x1b[31m%s\x1b[0m",
                        "\nKey already exists. Generate a new ID."
                    );
                    process.exit(1);
                }
                throw e;
            });
        return result.data[`create${tableName}`];
    }

    /**
     * This method updates a record in a table
     * @param {string} tableName name of the table to update
     * @param {UUID} id id of the record to update
     * @param {object} variables the variables to update the record with
     * @returns the record updated
    */
    async update(tableName, id, variables) {
        const query = gql`
            mutation ($id: ID!, $input: ${tableName}UpdateInput!) {
                update${tableName} (id: $id, input: $input) ${this.constructGQLResonse(tableName)}
            }
        `;

        const result = await this.client
            .mutate({
                mutation: query,
                variables: {
                    id: id,
                    input: variables,
                },
            })
            .catch((e) => {
                throw e;
            });

        return result.data[`update${tableName}`];
    }

    /**
     * This method deletes a record in a table
     * @param {string} tableName name of the table to delete
     * @param {UUID} id id of the record to delete 
     * @returns 
     */
    async delete(tableName, id) {
        const query = gql`
            mutation ($id: ID!) {
                delete${tableName} (id: $id)
            }
        `;

        const result = await this.client
            .mutate({
                mutation: query,
                variables: {
                    id: id,
                },
            })
            .catch((e) => {
                throw e;
            });

        return result.data[`delete${tableName}`];
    }

    /**
     * This method fetches all records from a table
     * @param {string} tableName the name of the table to fetch from
     * @param {object} filterObject A javascript object that represents a TailorDB filter
     * @returns {object[]} an array of records fetched
     */
    async fetchAll(tableName, filterObject = {}) {

        function stringifyTailorFilter(filterObject) {
            let result = "";

            for (const key in filterObject) {
                if (filterObject.hasOwnProperty(key)) {
                    const value = filterObject[key];
                    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                        result += `${key}: {${stringifyTailorFilter(value)}} `;
                    } else {
                        result += `${key}: ${JSON.stringify(value)} `;
                    }
                }
            }

            return result.trim();
        }

        let formattedFilter = "";
        if (filterObject) {
            formattedFilter = `( query: { ${stringifyTailorFilter(filterObject)} })`;
        }


        // make the first letter of the table name lowercase
        const pluralTableName = pluralize(tableName.charAt(0).toLowerCase() + tableName.slice(1));
        const query = `
            query {
                ${pluralTableName} ${formattedFilter} {
                    collection ${this.constructGQLResonse(tableName)}
                }
            }
        `;

        const result = await this.client
            .query({
                query: gql(query),
                variables: {},
            })
            .catch((e) => {
                throw e;
            });

        return result.data[pluralTableName].collection;
    }


    /**
     * This method fetches a single record from a table based on the id
     * @param {string} tableName the name of the table to fetch from
     * @param {UUID} id the id of the record to fetch
     * @returns data of the record fetched
     */
    async fetch(tableName, id) {
        // make the first letter of the table name lowercase
        const firstLowerTableName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
        const query = gql`
            query ($id: ID!) {
                ${firstLowerTableName} (id: $id) ${this.constructGQLResonse(tableName)}
            }
        `;

        const result = await this.client
            .query({
                query: query,
                variables: {
                    id: id,
                },
            })
            .catch((e) => {
                throw e;
            });

        return result.data[firstLowerTableName];
    }

    /**
     * This method runs a query or mutation based on the pipeline name and variables passed
     * @param {string} pipelineName the name of the query or mutation to run
     * @param {object} variables the variables to pass to the query or mutation
     * @returns data returned from the query or mutation
     */
    async runPipeline(pipelineName, variables = {}) {
        // 1. To figure out if the pipeline is a query or a mutation 
        //  we need to check if the pipeline exists in the Query or Mutation object
        let queryType = "query";
        let pipeline = this.pipelineArgs["Query"][pipelineName];
        if (!pipeline) {
            queryType = "mutation";
            pipeline = this.pipelineArgs["Mutation"][pipelineName];
            if (!pipeline) {
                throw new Error("Pipeline not found");
            }
        }

        // 2. Construct the query based on the pipeline arguments and the response
        const { input, output } = pipeline;
        const constructedQuery = `${queryType} ${input.length == 0 ? "" : "(" + input.map((arg) => `$${arg.name}: ${arg.type}`).join(", ") + ")"} {
                ${pipelineName} ${input.length == 0 ? "" : "(" + input.map((arg) => `${arg.name}: $${arg.name}`).join(", ") + ")"} ${output ? this.constructGQLResonse(output) : ""}
            }`;
        const query = gql(constructedQuery);

        // 3. Execute the query or mutation
        if (queryType == "mutation") {
            const result = await this.client
                .mutate({
                    mutation: query,
                    variables: variables,
                })
                .catch((e) => {
                    console.error(`Error running pipeline ${pipelineName} \n\n Query: ${constructedQuery} \n\n variables: ${JSON.stringify(variables)}`);
                    throw e;
                });

            return result.data[pipelineName];
        }

        const result = await this.client
            .query({
                query: query,
                variables: variables,
            })
            .catch((e) => {
                console.error(`Error running pipeline ${pipelineName} \n\n Query: ${constructedQuery} \n\n variables: ${JSON.stringify(variables)}`);
                throw e;
            });

        return result.data[pipelineName];
    }

    getQueryFields() {
        return this.queryFields;
    }
}