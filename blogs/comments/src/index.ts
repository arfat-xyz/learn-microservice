import express, { Request, Response, Application } from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

/**
 * Application Configuration
 */
const PORT = process.env.PORT || 4001;

/**
 * Type Definitions
 */
interface Comment {
  id: string;
  content: string;
  status: "Pending" | "approved" | "rejected";
}

interface PostComments {
  [postId: string]: Comment[];
}

/**
 * Application State
 *
 * In-memory storage for comments by post ID.
 * In a production environment, this would be replaced with a database.
 */
const commentsByPostId: PostComments = {};

/**
 * Express Application Setup
 */
const app: Application = express();
app.use(bodyParser.json());
app.use(cors());

/**
 * generate unique ID for each comment
 */
const generateCommentId = (): string => randomBytes(4).toString("hex");

/**
 * Health check endpoint handler
 */
const handleHealthCheck = (req: Request, res: Response) => {
  res.send("Assalamualikum. Service is running.");
};

/**
 * Get all comments for a specific post
 */
const handleGetCommentsByPostId = (req: Request, res: Response) => {
  const postId = req.params.id;

  if (!postId) {
    res.status(400).json({ error: "Post ID is required" });
    return;
  }

  // Return empty array if no comments exist for the post
  res.json(commentsByPostId[postId] || []);
};

/**
 * Create a new comment for a specific post
 */
const handleCreateComment = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { content, status } = req.body;
  const id = generateCommentId();

  // Validate input
  if (!postId) {
    res.status(400).json({ error: "Post ID is required" });
    return;
  }

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }
  if (!status) {
    res.status(400).json({ error: "Status is required" });
    return;
  }

  // Create new comment
  const newComment: Comment = {
    id,
    content,
    status,
  };

  // Initialize comments array if it doesn't exist for this post
  if (!commentsByPostId[postId]) {
    commentsByPostId[postId] = [];
  }

  // Add comment to the post
  commentsByPostId[postId].push(newComment);
  await axios.post(process.env.EVENT_API + "/events", {
    type: "commentCreated",
    data: { ...newComment, postId },
  });

  // Return the updated list of comments for this post
  res.status(201).json(commentsByPostId[postId]);
};
const createEvents = async (req: Request, res: Response) => {
  const { type, data } = req.body;
  if (type === "postCreated") {
    commentsByPostId[data?.id] = [];
  }
  if (type === "commentModerated") {
    const { postId, status, id } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => c.id === id);
    comment?.status === status;
    console.log(`api`, process.env.EVENT_API);
    console.log(comment, postId, status, id);
    await axios.post(process.env.EVENT_API + "/events", {
      type: "commentUpdated",
      data: { ...req.body.data },
    });
  }
  console.log({ type });
  res.status(201).send({});
};
/**
 * Route Definitions
 */
app.get("/", handleHealthCheck);
app.post("/events", createEvents);
app.get("/posts/:id/comments", handleGetCommentsByPostId);
app.post("/posts/:id/comments", handleCreateComment);
/**
 * Server Initialization
 */
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Comments service is running on port: ${PORT}`);
      // Consider using a proper logger in production
      // logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    // logger.error(`Server failed to start: ${error}`);
    process.exit(1);
  }
};

// Start the server
startServer();
