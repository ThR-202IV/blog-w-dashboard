import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const resp = await fetch("/api/post/getPosts");
      const data = await resp.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Hey there, inquisitive reader!
        </h1>
        <p className="text-gray-400 text-md">
          Code —— Prime is home for programming stories and ideas. Here, you can
          find insightful perspectives, useful knowledge, and everything about
          and related to the coding world — without being forced to subscribe to
          unnecessary mailing lists that will only clog up your inbox.
        </p>
        <p className="text-gray-400 text-md">
          Code —— Prime believes that what you read matters!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              Recent Articles
            </h2>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
