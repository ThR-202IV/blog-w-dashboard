import React, { useEffect, useState } from "react";
/* for displaying the time of our comments in the comment section */
import moment from "moment";
import { IoMdThumbsUp } from "react-icons/io";
import { useSelector } from "react-redux";

const Comment = ({ comment, onLike }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        const resp = await fetch(`/api/user/${comment.userId}`);
        const data = await resp.json();

        if (resp.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-200 pb-2">
          {comment.content}
        </p>
        {/* max-w-fit is the reason why the border above the thumbs-up icon and the number of likes fits the size of it  */}
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            onClick={() => onLike(comment._id)}
            /* dynamically changes tailwind styles based on a condition */
            className={`text-gray-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-300 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              "!text-green-500 dark:!text-green-300"
            }`}
          >
            <IoMdThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
