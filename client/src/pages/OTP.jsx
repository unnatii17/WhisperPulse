import React, { Suspense, useEffect, useState } from "react";
import Submitbutton from "../components/common/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaClockRotateLeft } from "react-icons/fa6";
import { Spinner } from "flowbite-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import OTPInput from "react-otp-input";
import { signUp } from "../services/operations/authAPI";
import Loader from "../components/common/Loader";
import { toast } from "react-hot-toast";

const OTP = () => {
  const { loading, signupData } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  // If signup data is missing, go back to signup
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    // ============================================
    // Check signup data
    // ============================================

    if (!signupData) {
      toast.error("Signup information not found");
      navigate("/signup");
      return;
    }

    // ============================================
    // Check OTP
    // ============================================

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    // ============================================
    // Get signup data
    // ============================================

    const {
      accountType,
      name,
      username,
      usn,
      email,
      password,
      confirmPassword,
      gender,
      branch,
      year,
    } = signupData;

    // ============================================
    // Required field validation
    // ============================================

    if (!name) {
      toast.error("Name is required");
      return;
    }

    if (!username) {
      toast.error("Username is required");
      return;
    }

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password is required");
      return;
    }

    if (!gender) {
      toast.error("Gender is required");
      return;
    }

    // ============================================
    // Reconstruct Avatar File
    // ============================================

    let avatarFile = null;

    const avatarBase64 =
      sessionStorage.getItem("avatarBase64");

    const avatarName =
      sessionStorage.getItem("avatarName");

    const avatarType =
      sessionStorage.getItem("avatarType");

    if (
      avatarBase64 &&
      avatarName &&
      avatarType
    ) {
      try {
        const base64Data =
          avatarBase64.split(",")[1];

        const byteString =
          atob(base64Data);

        const arrayBuffer =
          new ArrayBuffer(byteString.length);

        const uint8Array =
          new Uint8Array(arrayBuffer);

        for (
          let i = 0;
          i < byteString.length;
          i++
        ) {
          uint8Array[i] =
            byteString.charCodeAt(i);
        }

        avatarFile = new File(
          [arrayBuffer],
          avatarName,
          {
            type: avatarType,
          }
        );

      } catch (error) {
        console.error(
          "Avatar reconstruction failed:",
          error
        );

        avatarFile = null;
      }
    }

    // ============================================
    // Debug
    // ============================================

    console.log(
      "========== OTP SIGNUP DATA =========="
    );

    console.log({
      accountType,
      name,
      username,
      usn,
      email,
      gender,
      branch,
      year,
      otp,
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword,
      hasAvatar: avatarFile instanceof File,
    });

    // ============================================
    // Signup
    // ============================================

    dispatch(
      signUp(
        accountType || "Student",
        name,
        username,
        usn,
        email,
        password,
        confirmPassword,
        gender,
        branch,
        year,
        avatarFile,
        otp,
        navigate
      )
    );

    // ============================================
    // Remove temporary avatar data
    // ============================================

    sessionStorage.removeItem("avatarBase64");
    sessionStorage.removeItem("avatarName");
    sessionStorage.removeItem("avatarType");
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className="text-white flex items-center justify-center flex-col h-[calc(100vh-56px)]">

        {loading ? (
          <Spinner />
        ) : (
          <div className="py-12 flex-col flex gap-4 px-12 w-[90%] md:w-[420px] bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-400">

            <h1 className="text-2xl font-bold">
              Verify Email
            </h1>

            <p className="mb-4 text-base leading-1 text-[#ffffff]">
              A verification code has been sent to you.
              Enter the code below.
            </p>

            <form onSubmit={handleOnSubmit}>

              <OTPInput
                className="w-full p-6 text-white"
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={
                  <span className="text-white">
                    -
                  </span>
                }
                renderInput={(props) => (
                  <span className="rounded-xl text-white mx-auto px-[1px] newsmall:px-[1px] sm:px-[5px] py-[8px] border border-gray-100">
                    <input
                      {...props}
                      className="bg-transparent box-content text-white outline-none focus:ring-0 border-none"
                    />
                  </span>
                )}
              />

              <Submitbutton
                text="Verify Email"
                customClasses="w-full mx-auto mt-10"
              />

            </form>

            <div className="flex mt-2 justify-between items-center">

              <Link
                className="flex text-richblack-25 justify-center items-center"
                to="/"
              >
                <IoIosArrowRoundBack
                  fontSize={25}
                />

                <p className="text-sm group-hover:underline font-semibold">
                  Back to login
                </p>
              </Link>

              <button
                type="button"
                className="flex gap-1 hover:underline text-[#ffffff] justify-center items-center"
              >
                <FaClockRotateLeft
                  fontSize={15}
                />

                <p className="text-sm font-semibold">
                  Resend it
                </p>
              </button>

            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default OTP;
