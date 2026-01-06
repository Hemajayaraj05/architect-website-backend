import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes";
import { contactLimiter } from "./middlewares/ratelimit.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact",contactLimiter,contactRoutes);


export default app;
