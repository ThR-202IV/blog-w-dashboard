import React, { useEffect, useState } from "react";
/* for displaying the time of our comments in the comment section */
import moment from "moment";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});

  console.log(user);

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
      </div>
    </div>
  );
};

export default Comment;
