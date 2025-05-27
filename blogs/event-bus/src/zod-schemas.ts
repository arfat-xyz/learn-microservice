import { z } from "zod";

export const eventEnums = [
  "postCreated",
  "postDeleted",
  "commentCreated",
  "commentModerated",
  "commentUpdated",
] as const;
export const eventSchema = z.object({
  type: z.enum(eventEnums), // Now works!
  data: z.record(z.any()).optional(),
});
