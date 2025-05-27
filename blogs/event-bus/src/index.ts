import express, {
  Request,
  Response,
  Application,
  ErrorRequestHandler,
} from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { allRoutes } from "./allroutes";

// Configuration
dotenv.config();
const PORT = process.env.PORT || 4005;

// Express App Setup
const app: Application = express();
app.use(bodyParser.json());
app.use(cors());

// Controllers
const getRoot = (req: Request, res: Response) => {
  res.send("Assalamualikum");
};

// Routes
app.get("/", getRoot);
app.use(allRoutes);
// app.post("/events", postEvent);

// Error handling middleware (with proper typing)
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error("Unhandled error:", error.message);
  res.status(500).json({ status: "Internal Server Error" });
};

app.use(errorHandler);

// Server Initialization
const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();
