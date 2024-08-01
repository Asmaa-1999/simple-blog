// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line no-unused-vars
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center content-center">
        <img src="./404-.png" className="w-[100%] xl:w-[50%]  mt-[-2rem]" />
        {/* <button
          className={`btn text-white`}
          type="submit"
          style={{ backgroundColor: "#24B8EC" }}
        >
          <NavLink className="" to="/">
            Back
          </NavLink>
        </button> */}
      </div>
    </div>
  );
}
