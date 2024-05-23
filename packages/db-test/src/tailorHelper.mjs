import { $$ }  from "@tailor-platform/dev-cli/script";

/**
 * Helper class to interact with Tailor CLI
 * @author Aladdin Wattar
 */
export default class TailorHelper {
    constructor() {
        this.selectedApp = null;
    }
    async getAppURL() {
        let workspace;
        do {
            let workspaceJsonString;
            try {
                workspaceJsonString = await $$({
                    stdio: "pipe",
                })`tailorctl workspace describe -f json`;
            } catch (error) {
                throw new Error("Error retrieving workspace");
            }
            try {
                workspace = JSON.parse(workspaceJsonString.stdout);
            } catch (error) {
                throw new Error("Error parsing workspace");
            }
        } while (!workspace);

        const appsJsonString = await $$({
            stdio: "pipe",
        })`tailorctl workspace app list -f json`;
        const apps = JSON.parse(appsJsonString.stdout);
        if (apps.length === 0) {
            throw new Error("No apps found in the workspace.");
        }
        if (apps.length === 1) {
            this.selectedApp = apps[0];
        }
        return this.selectedApp.url
    }
    async generateMachineUserToken() {
        try {
            const tokenResult = await $$({
                stdio: "pipe",
            })`tailorctl workspace machineuser token -a ${this.selectedApp.name} -m admin-machine-user -f json`;
            const token = JSON.parse(tokenResult.stdout);
            // Directly access the parsed result assuming $$ already parses the JSON output
            if (Array.isArray(token) && token.length > 0 && token[0].access_token) {
                return token[0].access_token; // Extract the access token value
            } else {
                throw new Error("Token not found in the response.");
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
            throw new Error("Failed to retrieve token." + error);
        }
    }
}