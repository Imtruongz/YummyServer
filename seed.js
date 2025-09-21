import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
import { User } from "./Models/users.js";
import { Food } from "./Models/foods.js";
import { Category } from "./Models/categories.js";
import bcrypt from "bcrypt";

const mongoURL = process.env.MONGO_URL;

async function seed() {
  await mongoose.connect(mongoURL, { dbName: "Yummy" });
  console.log("Connected to DB for seeding");

  // Seed categories
  const categories = [
    {
      categoryName: "Món chính",
      categoryThumbnail: "https://i.imgur.com/monchinh.jpg"
    },
    {
      categoryName: "Tráng miệng",
      categoryThumbnail: "https://i.imgur.com/trangmieng.jpg"
    },
    {
      categoryName: "Đồ uống",
      categoryThumbnail: "https://i.imgur.com/douong.jpg"
    }
  ];
  await Category.deleteMany();
  const insertedCategories = await Category.insertMany(categories);
  console.log("Seeded categories");

  // Seed users
  const users = [
    {
      username: "admin",
      email: "admin@yummy.com",
      passwordHash: await bcrypt.hash("123456", 10),
      avatar: "https://i.imgur.com/adminavatar.jpg",
      description: "Quản trị viên hệ thống",
      facebookId: "",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "user1",
      email: "user1@yummy.com",
      passwordHash: await bcrypt.hash("123456", 10),
      avatar: "https://i.imgur.com/user1avatar.jpg",
      description: "Người dùng thử nghiệm",
      facebookId: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  await User.deleteMany();
  const insertedUsers = await User.insertMany(users);
  console.log("Seeded users");

  // Seed foods
  const foods = [
    {
      foodName: "Phở bò",
      categoryId: insertedCategories[0]._id,
      userId: insertedUsers[0]._id,
      foodDescription: "Phở bò truyền thống Việt Nam",
      foodIngredients: ["Bánh phở", "Thịt bò", "Hành", "Gia vị"],
      foodThumbnail: "https://i.imgur.com/phobo.jpg",
      foodSteps: ["Chuẩn bị nguyên liệu", "Nấu nước dùng", "Trụng bánh phở", "Hoàn thiện"],
      CookingTime: "45 phút"
    },
    {
      foodName: "Bánh flan",
      categoryId: insertedCategories[1]._id,
      userId: insertedUsers[1]._id,
      foodDescription: "Món tráng miệng ngọt ngào",
      foodIngredients: ["Trứng", "Sữa", "Đường", "Caramel"],
      foodThumbnail: "https://i.imgur.com/banhflan.jpg",
      foodSteps: ["Trộn nguyên liệu", "Đổ khuôn", "Hấp cách thủy"],
      CookingTime: "60 phút"
    },
    {
      foodName: "Trà sữa",
      categoryId: insertedCategories[2]._id,
      userId: insertedUsers[1]._id,
      foodDescription: "Đồ uống yêu thích của giới trẻ",
      foodIngredients: ["Trà", "Sữa", "Trân châu", "Đường"],
      foodThumbnail: "https://i.imgur.com/trasua.jpg",
      foodSteps: ["Pha trà", "Thêm sữa", "Cho trân châu"],
      CookingTime: "20 phút"
    }
  ];
  await Food.deleteMany();
  await Food.insertMany(foods);
  console.log("Seeded foods");

  mongoose.disconnect();
  console.log("Seeding done!");
}

seed();
