import { withAuth } from "@tailor-platform/auth/server";
import { config } from "./authConfig";

export default withAuth(config, {
  onError: (err) => {
    console.error(err);
  },
});
