import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const POSTS_URL = "/posts";

const AddPostForm = () => {
  const { auth } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reqStatus, setReqStatus] = useState("idle");

  const navigate = useNavigate();

  const canSave = title && content && reqStatus === "idle";

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setReqStatus("pending");

        const response = await axios.post(
          POSTS_URL,
          JSON.stringify({ title, content }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
            withCredentials: true,
          }
        );

        setTitle("");
        setContent("");
        navigate("/");
      } catch (err) {
        console.error("Failed to save the post.", err);
      } finally {
        setReqStatus("idle");
      }
    }
  };

  return (
    <section>
      <h2>Make a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          id="postTitle"
          type="text"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
        />

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
