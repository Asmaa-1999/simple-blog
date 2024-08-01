// eslint-disable-next-line no-unused-vars
import React from "react";
import GoogleButton from "react-google-button";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../configFire/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function SignInWIthGoogle() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log("gogo sign in" + user);;
      if (result.user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          lastName: "",
          imageUrl: user.photoURL,
          uid: user.uid,
          age: "",
        });
        toast.success("User Signin with Google Successfully!!", {
          position: "top-center",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(`${error.message} error`);
    }
  };

  return (
    <div>
      <GoogleButton
        onClick={signInWithGoogle}
        style={{
          color: "white",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}

export default SignInWIthGoogle;
