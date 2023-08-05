import { useState, useEffect } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import jwt_decode from "jwt-decode";

import { motion, AnimatePresence } from "framer-motion";
import TimeAgo from "../posts/TimeAgo";
import "./comments.css";

const CommentCard = ({ comment }) => {
  const { auth } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isCommentDeleted, setIsCommentDeleted] = useState(false);

  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;

  const roles = decoded?.UserInfo?.roles;
  const admin = 5150;

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isCommentOpen]);

  const deleteComment = async () => {
    try {
      const response = await axios.delete(`/comments/${comment._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      });
      setIsCommentDeleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const ExpandComment = () => {
    return (
      <span onClick={() => setIsCommentOpen(true)} className="expandComment">
        {"(see full comment)"}
      </span>
    );
  };

  const transition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <AnimatePresence>
      {!isCommentDeleted && (
        <motion.div
          className="commentCard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <p>
            {comment.author} <TimeAgo timestamp={comment.date} />
          </p>

          {roles && (roles.includes(admin) || comment.author === auth.user) && (
            <p
              className="deleteComment"
              onClick={async () => {
                await deleteComment();
              }}
            >
              delete
            </p>
          )}

          {
            // Check if the comment is open
            isCommentOpen ? (
              <p>{comment.content}</p>
            ) : // Check if the comment content is greater than 150 characters and the window width is less than 700px
            comment.content.length >= 150 && windowWidth < 700 ? (
              <p>
                {comment.content.substring(0, 150)} <ExpandComment />
              </p>
            ) : // Check if the comment content is greater than 250 characters
            comment.content.length > 250 ? (
              <p>
                {comment.content.substring(0, 250)} <ExpandComment />
              </p>
            ) : (
              // If all the above conditions are not met, render the full comment
              <p>{comment.content}</p>
            )
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentCard;
