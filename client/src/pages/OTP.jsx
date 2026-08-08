import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaClockRotateLeft } from "react-icons/fa6";
import { Spinner } from "flowbite-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import OTPInput from "react-otp-input";
import { toast } from "react-hot-toast";

import Submitbutton from "../components/common/SubmitButton";
import Loader from "../components/common/Loader";
import { signUp, sendOtp } from "../services/operations/authAPI";

const OTP = () => {
  const { loading, signupData } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [resending, setResending] = useState(false);

  // =====================================================
  // CHECK SIGNUP DATA
  // =====================================================

  useEffect(() => {
    if (!signupData) {
      toast.error("Signup information not found");
      navigate("/signup");
    }
  }, [signupData, navigate]);

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!signupData) {
      toast.error("Signup information not found");
      navigate("/signup");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

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

    // Required fields
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

    // =====================================================
    // RECONSTRUCT AVATAR
    // =====================================================

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
          [uint8Array],
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

    // =====================================================
    // SIGNUP
    // =====================================================

    const result = await dispatch(
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

    // Don't remove avatar before signup request finishes
    if (result) {
      sessionStorage.removeItem("avatarBase64");
      sessionStorage.removeItem("avatarName");
      sessionStorage.removeItem("avatarType");
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    if (!signupData?.email) {
      toast.error("Email not found");
      navigate("/signup");
      return;
    }

    if (resending) return;

    setResending(true);

    try {
      await dispatch(
        sendOtp(
          signupData.email,
          navigate
        )
      );

      setOtp("");
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );
    } finally {
      setResending(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Suspense fallback={<Loader />}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-4 py-10">

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Spinner
              aria-label="Loading"
              size="xl"
            />

            <p className="mt-4 text-gray-300">
              Creating your account...
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[460px] rounded-xl border border-gray-700 bg-gray-900/95 shadow-2xl p-8 sm:p-10">

            {/* Heading */}

            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">
                Verify Email
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-300">
                A verification code has been sent to
                your email.
                <br />
                Enter the 6-digit code below.
              </p>
            </div>

            {/* OTP FORM */}

            <form
              onSubmit={handleOnSubmit}
              className="mt-8"
            >
              <div className="flex justify-center">

                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  shouldAutoFocus
                  inputType="tel"
                  renderSeparator={
                    <span className="mx-1 text-gray-500">
                      -
                    </span>
                  }
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="!w-10 h-12 sm:!w-12 sm:h-14 rounded-lg border border-gray-600 bg-gray-800 text-center text-xl font-semibold text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                    />
                  )}
                />

              </div>

              {/* Verify Button */}

              <Submitbutton
                text="Verify Email"
                customClasses="w-full mt-8"
              />
            </form>

            {/* Bottom buttons */}

            <div className="flex items-center justify-between mt-8">

              {/* Back */}

              <Link
                to="/"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition"
              >
                <IoIosArrowRoundBack
                  fontSize={24}
                />

                <span className="text-sm font-semibold">
                  Back to login
                </span>
              </Link>

              {/* Resend */}

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className={`flex items-center gap-1 text-sm font-semibold transition ${
                  resending
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-yellow-400 hover:text-yellow-300"
                }`}
              >
                <FaClockRotateLeft
                  fontSize={15}
                />

                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>

            </div>

          </div>
        )}

      </div>
    </Suspense>
  );
};

export default OTP;
