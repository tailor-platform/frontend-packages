import QueryHelper from './queryHelper.mjs';
import TestContext from './testContext.mjs';
import TailorHelper from './tailorHelper.mjs';

/** @type {QueryHelper} */ 
let queryHelper;
/** @type {TestContext} */
let context;

beforeAll(async () => {
    // load data
    const tailorHelper = new TailorHelper();
    const tailorURL = await tailorHelper.getAppURL() + '/query';
    const tailorMachineToken = await tailorHelper.generateMachineUserToken();
    const dataFolderPath = process.env.TAILOR_TEST_DATA_FOLDER_PATH;

    queryHelper = new QueryHelper( tailorURL, tailorMachineToken);
    context = new TestContext(queryHelper);
    await queryHelper.loadQueryFields();
    await context.loadData(dataFolderPath);

    
}, 30000);

beforeEach(async () => {
    // fetch data
    await context.fetchData();
}, 30000);

afterEach(async () => {
    // fetch data
    await context.fetchData();
}, 30000);

afterAll(async () => {
    // delete all the data in the environment (env)
    await context.deleteData();
}, 30000);


export { context };