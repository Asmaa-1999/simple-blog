// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Link,NavLink } from "react-router-dom";
import { auth, db } from "../configFire/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// eslint-disable-next-line react/prop-types
function Navbar({ signOut ,userDetails }) {
  // const [userDetails, setUserDetails] = useState(null);
// 
  // const fetchUserData = async () => {
  //   auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       const docRef = doc(db, "Users", user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setUserDetails(docSnap.data());
  //       } else {
  //         console.log("User document does not exist");
  //       }
  //     } else {
  //       console.log("No user is logged in");
  //     }
  //   });
  // };

  useEffect(() => {
    // fetchUserData();
  }, []);

  if (!userDetails) {
    return null;
  }

  return (
    <div>
      <div className="navbar bg-base-100 shadow-md flex items-center justify-center">
        <div className="flex-1 ">
          <img
            src={"src/assets/imgs/logo.jpg"}
            alt="Logo"
            className="w-10 rounded-full cursor-pointer"
          />
          <a
            className="text-2xl font-serif mt-2 p-2 cursor-pointer"
            style={{ color: "#73bee2" }}
          >
            FloraFacts
          </a>
        </div>

        <div className="flex-none ">
          
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User avatar" src={userDetails?.imageUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink className="font-serif" to="/profile">
                 View Profile <span className="text-red-600 font-medium">new</span>
                </NavLink>
              </li>
              <li>
              <Link
                onClick={signOut}
                className="font-serif"
                to="/signin"
              >
                LogOut
              </Link>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
