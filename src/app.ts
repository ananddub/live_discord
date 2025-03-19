import express from "express";
import cors from "cors";
import { CONFIG } from "./config/config";

const app = express();

app.use(cors({ origin: "*" }));

app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on port ${CONFIG.PORT}`);
});

export default app;
