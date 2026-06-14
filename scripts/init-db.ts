import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { initDatabase } from "../lib/init-db";

initDatabase()
  .then(() => {
    console.log("Database ready");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
