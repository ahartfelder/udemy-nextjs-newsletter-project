import { useState, useEffect, useContext } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";

function Comments(props) {
  const { eventId } = props;

  const notificationCtx = useContext(NotificationContext);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComments(true);
      fetch("/api/comments/" + eventId)
        .then((res) => res.json())
        .then(async (data) => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          if (Array.isArray(data)) {
            setComments(data);
          } else {
            setComments([]);
          }
          setIsFetchingComments(false);
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Submitting comment...",
      message: "Your comment is being submitted!",
      status: "pending",
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then((data) => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then((data) => {
        if (data.comment) {
          setComments((prevComments) => [data.comment, ...prevComments]);

          notificationCtx.showNotification({
            title: "Success!",
            message: "Successfully posted your comment!",
            status: "success",
          });
        }
        console.log(data);
      })
      .catch((error) =>
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        })
      );
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments &&
        (isFetchingComments ? (
          <p>Loading comments...</p>
        ) : (
          <CommentList items={comments} />
        ))}
    </section>
  );
}

export default Comments;
