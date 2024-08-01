// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../configFire/firebaseConfig";

function LikeBtn({ post }) {
  const [likes, setLikes] = useState(post?.likes || []);

  const handleLike = async () => {
    const userId = auth?.currentUser?.uid;
    if (!userId) {
      alert("You need to be logged in to like posts");
      return;
    }

    const postRef = doc(db, "post", post?.id);

    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
      setLikes(likes.filter((like) => like !== userId));
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
      setLikes([...likes, userId]);
    }
  };

  return (
    <div>
      <div className="cursor-pointer" onClick={handleLike}>
        {likes.includes(auth?.currentUser?.uid) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </div>
      <span>{likes.length} Likes</span>

    </div>
  );
}

export default LikeBtn;
