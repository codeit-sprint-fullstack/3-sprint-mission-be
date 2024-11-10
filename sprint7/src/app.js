import express from "express";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);

app.use(errorHandler);

export default app;