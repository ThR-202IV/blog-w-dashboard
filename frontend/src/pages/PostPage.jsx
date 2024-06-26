import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        /* we set the loading to true at the beginning — even if its default state is true — 'cause if it had become false from a previous attempt to fetch data */
        setLoading(true);
        const resp = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await resp.json();
        if (!resp.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(false);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const resp = await fetch(`/api/post/getposts?limit=3`);
        const data = await resp.json();

        if (resp.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  /* adding a main tag is good for SEO purposes */
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-teal-200 mx-auto w-full max-w-2xl text-xs dark:border-teal-700 ">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        {/* time needed to complete reading the article. We base it on one minute for each 1000 characters */}
        {/* 'cause dividing the content length by 1000 would yeild a number with decimals, we use "toFixed" to give a whole number */}
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      {/* dangerouslySetInnerHTML property in a React application, is the equivalent of the innerHTML attribute in the browser DOM. A use case where you need to set the HTML content of a DOM element is when you populate a <div> element with the data coming from a rich text editor (like ReactQuill) */}
      {/* https://blog.logrocket.com/using-dangerouslysetinnerhtml-react-application/ */}
      {/* post-content is not a tailwind class, it is just a custom class name for our css poroperties. see: index.css */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
