import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Modal, Textarea } from "flowbite-react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ postId }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      return;
    }

    try {
      const resp = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await resp.json();

      /* if the result is ok, we clear the comment section */
      if (resp.ok) {
        setComment("");
        setCommentError(null);
        /* this automatically adds and shows our latest comment in the comments section as soon as we add it without the need to refresh */
        /* basically we add the latest comment at the beginning (data) whilst keeping the previous batch of comments */
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const resp = await fetch(`/api/comment/getPostComments/${postId}`);
        if (resp.ok) {
          const data = await resp.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const resp = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (resp.ok) {
        const data = await resp.json();
        /* we're updating the comments state based on the data we receive */
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : /* meaning, keep the comment as it is if the condition has failed */
                comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const resp = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        const data = await resp.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-gray-500 text-sm">
          <p className="dark:text-gray-400">Signed in as:</p>
          <div className="flex items-center gap-1">
            <img
              src={currentUser.profilePicture}
              alt=""
              className="h-5 w-5 object-cover rounded-full"
            />
            <Link
              to="/dashboard?tab=profile"
              className="text-sm text-cyan-500 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          Sign in to comment:
          <Link to={"/sign-in"} className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add your comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            /* the value attribute defines the value associated with the input and the value in the name/value pair that is sent to the server on form submission. The value attribute is used differently for different input types */
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-400 dark:text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button outline type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">Be the first to comment!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 rounded-full h-7 w-7 flex items-center justify-center pb-1 pt-1 shadow-lg">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="grey" onClick={() => setShowModal(null)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
