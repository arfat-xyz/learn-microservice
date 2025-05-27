import { useState } from "react";
import "./App.css";
import CreatePost from "./components/create-post";
import { PostList } from "./components/post-list";

function App() {
  const [refetchPost, setRefetchPost] = useState(false);
  return (
    <>
      <h1 className="text-5xl font-bold text-center mb-6">
        Mini Microservice Post
      </h1>
      <CreatePost setRefetchPost={setRefetchPost} />
      <PostList refetchPost={refetchPost} setRefetchPost={setRefetchPost} />
    </>
  );
}

export default App;
