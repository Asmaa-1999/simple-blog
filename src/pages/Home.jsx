// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import { auth, db, storage } from "../configFire/firebaseConfig";
import Navbar from "../components/navbar";
import Btnx from "../assets/svg/btnx.svg";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import List from "../components/List";
import ProfileDetails from "../components/ProfileDetails";



function Home() {
  const [isModel, setModel] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [isdisabled, setIsdisabled] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const navigate = useNavigate();
  const refInput = useRef(null);

  const SignOut = () => {
    return auth.signOut();
  };

  const openModel = () => {
    setModel(true);
  };

  const closeModel = () => {
    setModel(false);
  };

  const handelOnchangeImg = (e) => {
    const imgFile = e.target.files[0];
    setPreview(URL.createObjectURL(imgFile));
    setImage(imgFile);
  };

  const handelOnclickImg = () => {
    refInput.current.click();
  };

  const uploadImage = async () => {
    if (!image) return;

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed", error);
          toast.error("Upload failed: " + error.message);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  const handelAddPost = async (e) => {
    e.preventDefault();
    setIsdisabled(true);
    try {
      const downloadURL = await uploadImage();
      await addDoc(collection(db, "post"), {
        title: title,
        description: description,
        img: downloadURL,
        userId : auth?.currentUser?.uid,
        Timestamp: serverTimestamp(),
      });
      setIsdisabled(false);
      closeModel();
      toast.success("Post Added Successfully!!", {
        position: "top-center",
      });
      console.log("Post added successfully");
      navigate("/");
      setPreview(null);
      setImage(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error.message);
      toast.error("Error adding post, please try again", {
        position: "bottom-center",
      });
    }
  };

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User document does not exist");
        }
      } else {
        console.log("No user is logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userDetails) {
    return null;
  }
  return (
    <div className="bg-[#F4F2EE] ">
      <Navbar signOut={SignOut} userDetails={userDetails}></Navbar>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[30rem]">
          <ProfileDetails />
        </div>
        <div className="flex flex-col justify-center items-center md:block">
          <div
            className={`flex items-center gap-2 bg-white rounded-lg shadow-sm overflow-hidden border border-r-white mt-5 w-[100%] sm:w-[34rem] p-3`}
          >
            <img
              alt="Tailwind CSS Navbar component"
              src={userDetails.imageUrl}
              className="rounded-full w-[8%] "
            />
            <input
              type="text"
              placeholder="Start a post, try writing ..."
              readOnly
              className={`input input-bordered w-[90%] max-w-4xl cursor-pointer hover:bg-[#F4F2EE] shadow-none active:shadow-none`}
              style={{ outlineStyle: "none" }}
              onClick={openModel}
            />
          </div>
          <List></List>
        </div>
      </div>
      {/* model add */}
      {isModel && (
        <dialog
          open
          className="modal modal-bottom sm:modal-middle h-[100%] w-[100%] "
          id="my_modal_5"
          style={{ backgroundColor: "rgba(0%, 0%, 0% ,0.5)" }}
        >
          <div className="modal-box  sm:w-[50rem] max-w-none">
            <div className="flex items-center justify-between  px-2 mb-3">
              <h2 className="font-bold">Add Post</h2>
              <button
                className="btn btn-circle btn-ghost hover:rounded-full"
                onClick={closeModel}
              >
                <img src={Btnx} alt="x" className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handelAddPost}
              className="flex flex-col  justify-center gap-3"
            >
              <input
                type="text"
                name="title"
                placeholder="please enter post title .."
                className="input input-bordered w-full"
                required
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                rows="5"
                name="description"
                placeholder="What's on your mind ?"
                required
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
                  disabled={isdisabled}
                  className="btn px-10 btn-circle mt-3"
                  type="submit"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Home;
