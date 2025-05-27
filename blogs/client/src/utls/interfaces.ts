export interface Comment {
  id: string;
  content: string;
  status: "approved" | "pending" | "rejected";
}
export interface IPost {
  id: string;
  title: string;
  comments: Comment[];
}
