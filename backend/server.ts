import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import knowledgeRouter from "./routes/knowledge-routes.js";
import terminologyRouter from "./routes/terminology-routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/knowledge", knowledgeRouter);
app.use("/terminology", terminologyRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
