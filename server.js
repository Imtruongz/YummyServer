import express from "express";
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
import aiRouter from "./Routers/aiRouter.js";
import NotificationRouter from "./Routers/notificationsRouter.js";
import paymentRouter from "./Routers/paymentRouter.js";
import bankAccountRouter from "./Routers/bankAccountRouter.js";
import ratingRouter from "./Routers/ratingRouter.js";
import aiConversationRouter from "./Routers/aiConversationRouter.js";

const app = express();
dotenv.config({
  path: "./.env",
});

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
app.use("/api/ai", aiRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/bank-accounts", bankAccountRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/ai/conversations", aiConversationRouter);

//Listen to all IP addresse
const server = http.createServer(app);
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on portt : ${process.env.PORT}`);
});
