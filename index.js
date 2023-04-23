import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import colors from "colors";
import path from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("common"));

//todo: mongodb setup
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log(`connected !`.green);
});
mongoose.connection.on("connected", () => {
  console.log("connected".bgGreen);
});
mongoose.connection.on("disconnected", () => {
  console.log("disconnected".bgRed);
});

//todo: routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

//todo:error Middleware
app.use((err, req, resp, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return resp.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

//todo: express Port
app.listen(process.env.PORT, () => {
  console.log(`server at port: ${process.env.PORT}`.cyan);
});
