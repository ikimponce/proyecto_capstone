import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.error(err));

app.get("/api/games", (req, res) => {
  res.json([
    { id: 1, title: "Apex Legends", currentPlayers: 1200, groups: 300, roles: ["Healer","DPS"], updatedAt: new Date() },
  ]);
});

app.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));
