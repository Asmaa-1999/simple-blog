// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from "react";
import Btnx from "../assets/svg/btnx.svg";
import Edit from "../assets/svg/edit.svg";
import Delete from "../assets/svg/delete.svg";
import BtnDots from "../assets/svg/btndot.svg";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../configFire/firebaseConfig";
import { toast } from "react-toastify";
import LikeBtn from "./likeBtn";

function List() {
  const [list, setList] = useState([]);
  const [isModelDelete, setModelDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isModelEdit, setModelEdit] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const refInput = useRef(null);
  const [postLikes, setPostLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, "Users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return null;
  };

  useEffect(() => {
    const q = query(collection(db, "post"), orderBy("Timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const posts = [];
        for (const doc of snapshot.docs) {
          const post = { id: doc.id, ...doc.data() };
          const userData = await fetchUserData(post.userId);
          if (userData) {
            post.userData = userData;
          }
          posts.push(post);
        }
        setList(posts);
      },
      (error) => {
        console.error("Error fetching posts: ", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const handelOnchangeImg = (e) => {
    const imgFile = e.target.files[0];
    setPreview(URL.createObjectURL(imgFile));
    setImage(imgFile);
  };

  const handelOnclickImg = () => {
    refInput.current.click();
  };

  const openModelEdit = (post) => {
    if (post.userId !== auth.currentUser.uid) {
      toast.error("You don't have permission to edit this post.", {
        position: "bottom-center",
      });
      return;
    }

    setModelEdit(true);
    setPostToEdit(post);
    setTitle(post.title);
    setDescription(post.description);
    setPreview(post.img);
  };
  const closeModelEdit = () => {
    setModelEdit(false);
  };

  const openModel = (post) => {
    if (post.userId !== auth.currentUser.uid) {
      toast.error("You don't have permission to delete this post.", {
        position: "bottom-center",
      });
      return;
    }

    setModelDelete(true);
    setPostToDelete(post);
  };

  const closeModel = () => {
    setModelDelete(false);
  };

  const deletePost = async () => {
    if (!postToDelete) return;
    try {
      await deleteDoc(doc(db, "post", postToDelete.id));
      const newList = list.filter((post) => post.id !== postToDelete.id);
      setList(newList);
      toast.success("Post deleted successfully!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Error deleting post, please try again.", {
        position: "bottom-center",
      });
    } finally {
      closeModel();
    }
  };

  const handelEditePost = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    if (!postToEdit) return;
    try {
      await updateDoc(doc(db, "post", postToEdit.id), {
        title,
        description,
        img: preview,
      });

      const newList = list.map((post) =>
        post.id === postToEdit.id
          ? { ...post, title, description, img: preview }
          : post
      );
      setList(newList);
      toast.success("Post updated successfully!", {
        position: "top-center",
      });
      setIsDisabled(false);
    } catch (error) {
      toast.error("Error updating post, please try again.", {
        position: "bottom-center",
      });
    } finally {
      closeModelEdit();
    }
  };

  return (
    <div>
      {list.length > 0 ? (
        list.map((post) => (
          <div
            key={post.id}
            className="flex flex-col justify-center bg-white rounded-lg shadow-sm overflow-hidden border border-r-white mt-5 w-[100%] sm:w-[34rem]"
          >
            <div className="flex items-center justify-between p-1 px-4">
              <div className="flex">
                <img
                  alt="User Avatar"
                  src={post?.userData?.imageUrl}
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <h3 className="ms-3 font-medium">
                    {post?.userData?.firstName +
                      "  " +
                      post?.userData?.lastName}
                  </h3>
                  <h4 className="ms-3 mt-1 text-[0.7rem]">
                    {new Date(post.Timestamp?.seconds * 1000).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </h4>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <button className="btn btn-circle btn-ghost bg-none border-none bg-transparent shadow-none">
                  <div className="dropdown dropdown-bottom dropdown-end bg-none">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-none bg-transparent"
                    >
                      <img
                        src={BtnDots}
                        alt="Options"
                        className="inline-block h-6 w-6 stroke-current"
                      />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow w-40 "
                    >
                      <span
                        className="flex flex-wrap align-center flex-row hover:bg-[#D2D4D7]"
                        onClick={() => openModelEdit(post)}
                      >
                        <p className="hover:bg-transparent flex gap-2 p-3">
                          <img
                            src={Edit}
                            alt="Edit"
                            className="h-5 w-5 hover:bg-transparent active:bg-transparent"
                          />
                          <span>Edit Post</span>
                        </p>
                      </span>
                      <span
                        className="flex flex-wrap align-center flex-row hover:bg-[#D2D4D7]"
                        onClick={() => openModel(post)}
                      >
                        <p className="hover:bg-transparent flex gap-2 p-3">
                          <img
                            src={Delete}
                            alt="Delete"
                            className="h-5 w-5 hover:bg-transparent"
                          />
                          <span> Delete Post</span>
                        </p>
                      </span>
                    </ul>
                  </div>
                </button>
                <button className="btn btn-circle btn-ghost hover:rounded-full">
                  <img src={Btnx} alt="Close" className="h-5 w-5" />
                </button>
              </div>
            </div>
            <img
              src={post.img}
              alt="Img no available"
              className="w-full h-[36rem] object-fit"
            />
            <div className="py-1 px-4 flex">
              <LikeBtn post={post} />
              <div className="cursor-pointer me-2">
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
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
              </div>
              <div className="cursor-pointer me-2">
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
                    d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                  />
                </svg>
              </div>
            </div>
            <div className="pb-1 px-4">
              <h2 className="mb-1 font-bold">{post.title}</h2>
              <p>{post.description}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-5">
          {/* <h2>Oops !!</h2> */}
          <p>No posts available</p>
        </div>
      )}
      {/* Edit model */}
      {isModelEdit && (
        <dialog
          open
          className="modal modal-bottom sm:modal-middle h-[100%] w-[100%] "
          id="my_modal_5"
          style={{ backgroundColor: "rgba(0%, 0%, 0% ,0.5)" }}
        >
          <div className="modal-box  sm:w-[50rem] max-w-none">
            <div className="flex items-center justify-between  px-2 mb-3">
              <h2 className="font-bold">Edit Post</h2>
              <button
                className="btn btn-circle btn-ghost hover:rounded-full"
                onClick={closeModelEdit}
              >
                <img src={Btnx} alt="x" className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handelEditePost}
              className="flex flex-col  justify-center gap-3"
            >
              <input
                type="text"
                name="title"
                placeholder="please enter post title .."
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                rows="5"
                value={description}
                name="description"
                placeholder="What's on your mind ?"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={handelOnclickImg}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <label htmlFor="imgFile cursor-pointer">Add media</label>

                <input
                  id="imgFile"
                  type="file"
                  name="img"
                  accept="image/*"
                  placeholder="Add media"
                  className="input hidden"
                  ref={refInput}
                  onChange={handelOnchangeImg}
                />
              </div>
              {preview && (
                <div className="max-w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover h-[20rem]"
                  />
                </div>
              )}

              <div className="modal-action flex flex-col justify-center items-end">
                <div className="w-full h-[0.01rem] bg-slate-300"></div>
                <button
                  disabled={isDisabled}
                  className="btn px-10 btn-circle mt-3"
                  type="submit"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* delete model */}
      {isModelDelete && (
        <dialog
          open
          id="my_modal_1"
          className="modal modal-bottom sm:modal-middle h-[100%] w-[100%]"
          style={{ backgroundColor: "rgba(0%, 0%, 0% ,0.5)" }}
        >
          <div className="modal-box shadow">
            <h3 className="font-bold text-lg">Delete Post</h3>
            <p className="py-4">Are you sure you want to delete this post?</p>
            <div className="modal-action">
              <button
                className="btn btn-outline btn-success hover:text-white"
                onClick={closeModel}
              >
                Close
              </button>
              <button
                className="btn btn-outline btn-error hover:text-white"
                onClick={deletePost}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default List;
