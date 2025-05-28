import { NextFunction, Request, Response, Router } from "express";
import { eventSchema } from "./zod-schemas";
import axios from "axios";
import { z } from "zod";

const router = Router();
const events: {
  type:
    | "postCreated"
    | "postDeleted"
    | "commentCreated"
    | "commentModerated"
    | "commentUpdated";
  data?: Record<string, any> | undefined;
}[] = [];
const postEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const event = eventSchema.parse(req.body);
    console.log(`Before promise`, event);
    events.push(event);
    await Promise.all([
      axios.post(`${process.env.POST_API}/events`, event),
      axios.post(`${process.env.COMMENT_API}/events`, event),
      axios.post(`${process.env.QUERY_API}/events`, event),
      axios.post(`${process.env.COMMENT_MODERATE_API}/events`, event),
    ]);
    console.log(`After promise`);
    res.status(201).json({ status: "OK" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Zod Error:`, { error: error.message });
      return res.status(400).json({
        status: "Validation Error",
        errors: error.errors,
      });
    }

    // console.error("Error posting event:", error);
    next(error);
  }
};
const getEvents = async (req: Request, res: Response): Promise<any> => {
  res.send(events);
};

router.post("/events", postEvent);
router.get("/events", getEvents);
export const allRoutes = router;
