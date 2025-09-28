import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { connectDB } from "./utils/features.js";

import {
  corsConfig,
  parseCookies,
  // rateLimiter,
  securityHeaders,
} from "./Config/securityConfig.js";

//Router
import userRouter from "./Routers/usersRouter.js";
import foodsRoute from "./Routers/foodsRoute.js";
import categoriesRouter from "./Routers/categoriesRouter.js";
import favoriteFoodsRouter from "./Routers/favoriteFoodsRouter.js";
import foodReviewsRouter from "./Routers/foodReviewsRouter.js";
import followRouter from "./Routers/followRouter.js";
import NotificationRouter from "./Routers/notificationsRouter.js";

const app = express();
dotenv.config({
  path: "./.env",
});

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(securityHeaders);
// app.use(rateLimiter);
app.use(corsConfig);
app.use(parseCookies);

//Connect to MongoDB
const mongoURL = process.env.MONGO_URL;
connectDB(mongoURL);

app.use("/api/users", userRouter);
app.use("/api/foods", foodsRoute);
app.use("/api/categories", categoriesRouter);
app.use("/api/favoriteFoods", favoriteFoodsRouter);
app.use("/api/foodReviews", foodReviewsRouter);
app.use("/api/follow", followRouter);
app.use("/api/notifications", NotificationRouter);

//Listen to all IP addresse
const server = http.createServer(app);
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on portt : ${process.env.PORT}`);
});
