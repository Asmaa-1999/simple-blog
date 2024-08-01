import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./configFire/firebaseConfig";
import { useState, useEffect } from "react";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log({currentUser});
  return (
    <>
      <div>
        <Routes>
          <Route
            path="/signin"
            element={!currentUser ? <Signin /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={currentUser ? <Home /> : <Navigate to="/signin" />}
          />
          <Route
            path="/signup"
            element={!currentUser ? <Signup /> : <Navigate to="/signin" />}
          />
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/signin" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
