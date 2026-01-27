import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes";
import { contactLimiter } from "./middlewares/ratelimit.middleware";
import ProjectRoutes from "./routes/project.routes";
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/api/contact",contactLimiter,contactRoutes);
app.use('/',ProjectRoutes);
export default app;
