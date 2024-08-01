// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../css/signin.module.css";
import Icon from "../assets/svg/user.svg";
import { toast } from "react-toastify";
import { auth } from "../configFire/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import SignInWIthGoogle from "../components/signInWIthGoogle";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(`${user.email} user signin done`);
      toast.success("User Signin Successfully!!", {
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      console.log(`${error.message} error`);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className={`${styles.background} `}>
      <div className={`${styles.layer}`}>
        <div
          className={`${styles.containerForm} card shadow-xl w-[20rem] md:w-[25rem]`}
        >
          <div className="flex justify-center items-center mb-10">
            <img src={Icon} alt="Icon" className="h-10 w-10 opacity-70 mr-2" />
            <h2 className="text-white font-mono text-2xl md:text-4xl font-semibold">
              Login
            </h2>
          </div>

          <form onSubmit={handleSignin}>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered text-white border-white w-full max-w-4xl mb-5 bg-transparent focus:bg-white focus:text-black"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered text-white border-white w-full max-w-4xl mb-5 bg-transparent focus:bg-white  focus:text-black"
            />
            <button
              className={`btn bg-white w-full max-w-4xl mt-10  font-medium text-xl ${styles.btn}`}
              type="submit"
              style={{ color: "#436E81" }}
            >
              Login
            </button>
          </form>

          <span className="text-white mt-5 text-base">
            {`Don't have an account? `}
            <NavLink to="/signup" className="font-bold">
              Register
            </NavLink>
          </span>
          <div className="w-full flex justify-center items-center m-5">
            <div className={`${styles.line}`}></div>
            <h2 className="font-medium text-white">OR</h2>
            <div className={`${styles.line}`}></div>
          </div>
          <SignInWIthGoogle />
        </div>
      </div>
    </div>
  );
}

export default Signin;
