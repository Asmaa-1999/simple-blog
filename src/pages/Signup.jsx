// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../css/signup.module.css";
// import { CreateUser } from "../configFire/authFunctionjsx";
import { auth, db, storage } from "../configFire/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const refInput = useRef(null);
  const [isdisabled, setIsdisabled] = useState(false);

  const handelOnchangeImg = (e) => {
    const imgFile = e.target.files[0];
    setPreview(URL.createObjectURL(imgFile));
    setImage(imgFile);
  };

  const handelOnclickInput = () => {
    refInput.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsdisabled(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `userImages/${user.uid}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        age: age,
        uid: user.uid,
        imageUrl: imageUrl,
        post:[],
      });
      setIsdisabled(false);
      navigate("/signin");
      console.log("tesdfghjkllllllllllllllllllllllllllll");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred. Try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className={`grid grid-cols-3`}>
      <div className={`${styles.background} hidden lg:block p-3 xl:p-10`}>
        <h2 className={`${styles.font} mt-48 text-4xl font-bold`}>
          Creation starts here ..
        </h2>
        <p className={`${styles.fontp} mt-3 `}>
          {`You have access to many different plants you can't find anywhere else.`}
        </p>
      </div>

      <div className="col-span-3 lg:col-span-2  grid grid-rows-12 w-full">
        <div className="flex justify-center items-center flex-col row-span-2 p-3 mt-2">
          <h2 className={`font-mono text-4xl font-semibold ${styles.font}`}>
            Join FloraFacts
          </h2>
          <p className="mt-5 text-base">
            {`Already have an account?`}
            <NavLink
              to="/signin"
              className="font-medium text-xl"
              style={{ color: "#aac2c4" }}
            >
              Login
            </NavLink>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="row-span-10 flex justify-center items-center max-w-3xl mx-auto p-6 md:p-3"
        >
          <div className="flex flex-wrap justify-center items-center">
            <div className="avatar placeholder flex justify-start p-3">
              <div
                onClick={handelOnclickInput}
                className="bg-[#AAC2C4] text-neutral-content w-20 rounded-full cursor-pointer"
              >
                {preview ? (
                  <img
                    id="imgFile"
                    alt="Profile Preview"
                    src={preview}
                    className="rounded-full w-20 h-20 object-cover"
                  />
                ) : (
                  <span className="text-sm text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            <input
              type="file"
              name="img"
              accept="image/*"
              placeholder="Add media"
              className="input hidden"
              required
              ref={refInput}
              onChange={handelOnchangeImg}
            />
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full mb-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
                className={`input input-bordered w-full focus:bg-white `}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
                className={`input input-bordered w-full focus:bg-white`}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <input
                type="text"
                placeholder="Age"
                value={age}
                required
                onChange={(e) => setAge(e.target.value)}
                className={`input input-bordered w-full max-w-4xl focus:bg-white ${styles.input}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-bordered w-full max-w-4xl focus:bg-white  ${styles.input}`}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`input input-bordered w-full max-w-4xl focus:bg-white  ${styles.input}`}
              />
            </div>
            <button
              disabled={isdisabled}
              className={`btn text-white w-full max-w-4xl mt-24  font-medium text-2xl`}
              type="submit"
              style={{ backgroundColor: "#aac2c4" }}
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
