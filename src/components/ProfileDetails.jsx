// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { auth, db } from "../configFire/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function ProfileDetails() {
  const [userDetails, setUserDetails] = useState(null);

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
    <div className="mt-5 w-full flex justify-center items-start md:px-8">
      <div
        className={`flex flex-col justify-center items-center gap-2 bg-white rounded-lg shadow-sm overflow-hidden border border-r-white w-[100%] md:w-[22rem]`}
      >
        <img
          alt="Tailwind CSS Navbar component"
          src={userDetails.imageUrl}
          className="rounded-full w-[10%] md:w-[20%]"
        />
        <h2 className="font-medium">
          {userDetails.firstName +" "+ userDetails.lastName}
        </h2>
        <h4 className="font-thin text-[13px] pb-2">{userDetails.email}</h4>
      </div>
    </div>
  );
}

export default ProfileDetails;
