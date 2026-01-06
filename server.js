import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { definitionRouter } from "./routes/definition-routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', definitionRouter);

const TOKEN_URL = process.env.TOKEN_URL;
const FHIR_BASE_URL = process.env.FHIR_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get("/health", (req, res) => {
  res.json({ status: "ok" }).status(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
