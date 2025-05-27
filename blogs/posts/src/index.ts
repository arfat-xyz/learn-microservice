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

// Helper Functions
const generateId = (): string => randomBytes(4).toString("hex");

// Controllers
const getRoot = (req: Request, res: Response) => {
  res.send("Assalamualikum");
};

const getAllPosts = (req: Request, res: Response) => {
  res.json(posts);
};

const createPost = async (req: Request, res: Response) => {
  const id = generateId();

  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  posts[id] = { id, title };
  await axios.post(process.env.EVENT_API + "/events", {
    type: "postCreated",
    data: { id, title },
  });
  res.status(201).json(posts[id]);
};

const createEvents = async (req: Request, res: Response) => {
  console.log({ type: req.body.type });
  res.status(201).send({});
};

// Routes
app.get("/", getRoot);
app.get("/posts", getAllPosts);
app.post("/posts", createPost);
app.post("/events", createEvents);

// Server Initialization
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      // Logger.logger.info(`Server is running on port: ${PORT}`); // if you have logging
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    // Logger.errorLogger.error(`Failed to start server: ${error}`); // if you have logging
    process.exit(1); // Exit with failure code
  }
};

startServer();
