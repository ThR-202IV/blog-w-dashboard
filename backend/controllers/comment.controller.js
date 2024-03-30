import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "Sign in to comment"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    /* we want to sort it based on the latest comment */
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found!"));
    }

    /* we want to check if the user had already liked the comment, and for that we check inside tha array of likes for a user with this user id */
    const userIndex = comment.likes.indexOf(req.user.id);

    /* if the user id is not found inside the array, we then add the user to the likes array */
    if (userIndex === -1) {
      /* we add 1 to the previous amount of likes */
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(404, "You're not allowed to edit this comment!")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      /* we're changing only the content */
      {
        content: req.body.content,
      },
      /* we want the latest updated comment returned */
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(404, "You're not allowed to delete this comment!")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted!");
  } catch (error) {
    next(error);
  }
};
