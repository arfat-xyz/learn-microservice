import express, { Request, Response, Application } from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 4000;

// Types
interface Post {
  id: string;
  title: string;
}

interface Posts {
  [key: string]: Post;
}

// App State
const posts: Posts = {};

// Express App Setup
const app: Application = express();
app.use(bodyParser.json());
app.use(cors());

// Controllers
const getRoot = (req: Request, res: Response) => {
  res.send("Assalamualikum");
};

const getAllPosts = (req: Request, res: Response) => {
  res.json(posts);
};

const moderateComment = async (req: Request, res: Response) => {
  const { type, data } = req.body;
  console.log({ type });
  if (type === "commentCreated") {
    data.status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post(process.env.EVENT_API + "/events", {
      type: "commentModerated",
      data,
    });
  }

  res.status(201).json({});
};

// Routes
app.get("/", getRoot);
app.get("/posts", getAllPosts);
app.post("/events", moderateComment);

// Server Initialization
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1); // Exit with failure code
  }
};

startServer();
