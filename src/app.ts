import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes";
import { contactLimiter } from "./middlewares/ratelimit.middleware";
import ProjectRoutes from "./routes/project.routes";
import reviewRoutes from "./routes/review.routes";
const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
// if (process.env.NODE_ENV === "production") {
// }
app.set("trust proxy", 1);

app.use("/api/contact", contactLimiter, contactRoutes);
app.use('/', ProjectRoutes);
app.use('/', reviewRoutes);
export default app;
