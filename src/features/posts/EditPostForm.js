import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const EditPostForm = () => {
  const { postId } = useParams();
  const { auth } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const effectRan = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    const getPost = async () => {
      try {
        const response = await axios.get(`/posts/${postId}`, {
          signal: controller.signal,
        });
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (effectRan.current) getPost();

    // if (post.author !== auth.user) navigate('/login')

    return () => {
      controller.abort();
      effectRan.current = true;
    };
  }, []);

  const canSave = title && content;

  const onSavePostClicked = async () => {
    try {
      const response = await axios.put(
        "/posts",
        JSON.stringify({ id: postId, title, content }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );
      navigate(`../${postId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <section>
        <p>Loading post...</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
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

export default EditPostForm;
