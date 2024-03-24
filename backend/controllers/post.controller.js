import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You're not allowed to create a post"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields!"));
  }

  /* for SEO purpose, it's better to have a slug instead of just having the post id for the URL */
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    /* the index after which the fetching must start */
    const startIndex = parseInt(req.query.startIndex || 0);

    /* the number of posts that would be shown at a time */
    const limit = parseInt(req.query.limit || 9);

    /* if the number is 1, mongoDB will show in ascending otherwise in the descending format */
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      /* postId is "_id" in mongoDB */
      ...(req.query.postId && { _id: req.query.postId }),
      /* searchTerm will search in both title and content of the post */
      ...(req.query.searchTerm && {
        /* using $or allows us to search in two places, like: title and content */
        /* options: "i" means case insensitive  */
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      /* we're sorting using the 'updatedAt' as this is more important than the 'createdAt' in regards to blog posts */
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    /* total number of posts in the DB 'cause we need to show the total number of posts in the dashboard */
    const totalPosts = await Post.countDocuments();

    /* amount of posts created in the last month */
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const amountOfPostsInLastMonth = await Post.countDocuments({
      /* all items created after 'oneMonthAgo' */
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, amountOfPostsInLastMonth });
  } catch (error) {
    next(error);
  }
};
