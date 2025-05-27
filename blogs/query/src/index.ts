import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 4000;

// Types

interface Comment {
  id: string;
  content: string;
  status: string;
}
interface Post {
  id: string;
  title: string;
  comments: Comment[];
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

const handleEvent = (type: any, data: any, res?: Response) => {
  if (type === "postCreated") {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === "commentCreated") {
    const { id, content, postId, status } = data;
    if (!posts[postId]) {
      if (res) {
        res.status(400).json({ error: "Post not found" });
      }
      return;
    }
    posts[postId].comments.push({ id, content, status });
  }
  if (type === "commentModerated") {
    const { id, postId } = data;

    if (!posts[postId]) {
      if (res) {
        res.status(400).json({ error: "Post not found" });
      }
      return;
    }
    const status = data.content.includes("orange") ? "rejected" : "approved";
    // Find the index of the comment with the matching ID
    const commentIndex = posts[postId].comments.findIndex(
      (comment) => comment.id === id
    );

    if (commentIndex !== -1) {
      // Update existing comment
      posts[postId].comments[commentIndex].status = status;
    }
  }
  if (type === "commentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    console.log({ post, id, content, postId, status });
    const comment = post.comments.find((c) => c.id === id);
    if (!comment) {
      if (res) {
        res.status(400).json({ error: "Comment not found" });
      }
      return;
    }
    comment.status = status as string;
    comment.content = content as string;
  }
};

// Controllers
const getRoot = (req: Request, res: Response) => {
  res.send("Assalamualikum");
};

const getAllPosts = (req: Request, res: Response) => {
  res.json(posts);
};
const getAllCommentsRelatedToPost = (req: Request, res: Response) => {
  const postId = req.params.id;

  if (!postId) {
    res.status(400).json({ error: "Post ID is required" });
    return;
  }

  // Return empty array if no comments exist for the post
  res.json(posts[postId].comments || []);
};

const createEvent = (req: Request, res: Response) => {
  const { type, data } = req.body;
  handleEvent(type, data, res);
  res.status(201).json({});
};

// Routes
app.get("/", getRoot);
app.get("/posts", getAllPosts);
app.get("/posts/:id/comments", getAllCommentsRelatedToPost);
app.post("/events", createEvent);

// Server Initialization
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, async () => {
      console.log(`Server is running on port: ${PORT}`);
      const res = await axios.get(process.env.EVENT_API + "/events");
      for (let event of res.data) {
        console.log(`Processing event: `, event.type);
        handleEvent(event.type, event.data);
      }
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1); // Exit with failure code
  }
};

startServer();
