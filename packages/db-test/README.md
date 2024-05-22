# DB TEST
This is a simple library to test graphql workflows and pipelines.
As a side feature, also generates graphql queries automatically and saves them to a folder.

## NPM Commands

### gqlprint

Creates a .gql file for each query type (getOne(singular), list(plural), create, update, delete, and bulkUpsert) for the given type(s).
File names are in the format of {queryName}.gql, such as createPurchaseOrder.gql

**npm exec gqlprint -- --type PurchaseOrder --output my-output-directory**
- creates all (create, update, delete, fetch) GQL queries for PurchaseOrder and saves files in my-output-directory


**npm exec gqlprint -- --type ["PurchaseOrder","PurchaseOrderLineItem"] --output my-output-directory**
- creates all GQL queries for PurchaseOrder and PurchaseOrderLineItem and saves files in my-output-directory

**npm exec gqlprint -- --cue my-cue-tailor-db.json --output my-output-directory**
- parses the json located at my-cue-tailor-db.json, extracts the Type names and saves the files in my-output-directory


### tailor-test

Runs tailor tests. To do this it follows these steps:
1. **Creates** all the test data in the data folder
2. Loads test data into the **context.env**
3. **Runs** all **XYZ.test.js** files in the chosen folder
4. After each test **automatically re-fetch** everything in **context.env**
5. After all tests run, **deletes** every record loaded to **context.env**


**npm exec tailor-test my-tests-folder**

- Runs tests in the tests in my-tests-folder
- my-tests-folder/data folder should hold the data


## Setup

1. Import the db-test module in your project
2. Start a minitailor instance of any template
3. Create the following folder structure:

- your-template
    -  tests
        - data // contains the data in json format
            - contact.json 
            - otherTable.json
        - tests // contains the tests
            - testWorkflow1.test.js 
            - testWorkflow2.test.js

## Creating test data

### Basic files
Create json files with the following format
```json 
{
    "TableName": {
        "customEasyAccessName": {
            "requiredValue1": "value1",
            "requiredValue2": "value2"
        }
    }
}
```

For example:
```json 
{
    "CostPool": {
        "costPool1": {
            "name": "TEST COST POOL1"
        }
    }
}
```

### ID's and Foreign keys

You don't need to specify the id of each record, it will be automatically generated.

On the other hand here is how you specify foreign keys

```json
{
    "ParentTable": {
        "parentTable1": {
            "name": "Parent"
        }
    },
    "ChildTable": {
        "childTable1": {
            "parentTableID": { "UUID": "ParentTable.parentTable1"},
            "name": "Child",
        }
    }
}
```

Basically, if you need to assign a UUID, in that field you need the following object:
```json
{ "UUID": "ParentTable.parentTable1"}
```
Which points to the parentTable1 object inside ParentTable 

```md
NOTES
- The order in which you create data does not matter. It will be ordered before creation automatically.
- File names do not matter.
- If there is an error in the data an error will be thrown
- If there is a loop in the db structure an error will be thrown
```

## Writing tests


### Understanding context.env
```javascript
import { context } from "@tailor-platform/db-test";

test("this is a demo test", async () => {
    // All json files in the data folder is loaded to the context.env object
    // You can access your objects like this
    const contact = context.env.Contact.contact1

    // All fields of contact will automatically be fetched
    // even if they don't exist on the json data
    const createdAt = contact.createdAt

    // The context loads everything in a depth of 3 by default,
    // This means if contact had a contactParent
    // you could do this
    const contactParent = context.env.Contact.contact1.contactParent;

    // and here is how you could access the name
    const contactParentName = context.env.Contact.contact1.contactParent.name;

    // All of the data in context.env will automatically be deleted
    // If you create a record be sure to add it to the environment
    const newContact = context.create("Contact", {
        name: "Daniel Alvarez"
    })
    context.addToEnv("Contact", "myNewContact", newContact);
});
```

### Creating, updating, fetching and deleting
```javascript
import { context } from "@tailor-platform/db-test";

test("this is a demo test", async () => {
    const contact = context.env.Contact.contact1

    // To CREATE pass the TableName as the fist argument
    // and variables as the second 
    const newContact = await context.create("Contact", {
        name: "Daniel Alvarez"
    });
    // use addToEnv if you want the record to be deleted after the tests
    context.addToEnv("Contact", "myNewContact", newContact);


    // To UDPATE pass the TableName as the fist argument
    // id as the second
    // and variables as the third
    await context.update("Contact", contact.id, {
        name: "Alvarez Daniel"
    });
    // After this update the context will be automatically updated
    // so if you do this:
    console.log(contact.name);
    // You'll get "Alvarez Daniel"


    // To DELETE pass the TableName as the first argument
    // and the id as the second
    await context.delete("Contact", contact.id);
    // Deleting in tests is not reccomended 
    // but you can do it if you need to


    // To FETCH pass the TableName as the first argument
    // and UUID as the second
    const myFetchedContact = await context.fetch("Contact", "aaaa-bbbb-cccc-dddddddd-eeee");


    // To FETCH ALL pass the TableName as the first argument
    // This returns a list of all contact objects
    const allContacts = await context.fetchAll("Contact");

    // To FETCH ALL WITH A TAILOR FILTER 
    // pass the TableName as the first argument
    // pass the tailor filter as the second
    const filteredContacts = await context.fetchAll("Contact", {
        name: { in: ["Daniel", "Yutaro", "Yo"] }
    });
});
```


### Running pipelines
```javascript
import { context } from "@tailor-platform/db-test";

test("this is a demo test", async () => {
    // To run pipelines use the runPipeline method
    // It takes the exact pipeline name as the first argument
    // and the input variables as the second
    const myPipelineResult = await context.runPipeline("myPipeline", {
        input: {
            myInputVars: "something"
        }
    })

    // If your pipeline doesn't need arguments you 
    // can leave them empty
    const myPipelineNoArgsResult = await context.runPipeline("myPipelineNoArgs");

    // The data in context.env will be automatically 
    // refreshed after runPipeline runs
});
```