// eslint-disable-next-line no-unused-vars
import React from "react";

export default function Profile() {
  return (
    <div>
      <div
        className="container mx-auto text-center py-20 h-screen object-cover text-[#593d9e] flex justify-center items-center flex-col"
        // style={{ backgroundImage: "url(src/assets/imgs/c2png.png)" }}
      >
        <img
          src="public\construct.png"
          className="w-[90%] xl:w-[50%]  mt-[-2rem]"
        />
        <div className="block">
          <h1 className="text-xl font-bold mb-4 ">Page Under Construction</h1>
          <p className="text-l mb-2">
            {` We're working hard to bring you this page`}
          </p>
          <span>Stay tuned for updates! </span>
        </div>
      </div>
    </div>
  );
}
