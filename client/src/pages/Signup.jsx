import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SignUpInput from "../components/common/SignUpInput";
import PasswordInput from "../components/common/PasswordInput";
import SubmitButton from "../components/common/SubmitButton";

import { RxAvatar } from "react-icons/rx";
import { HiCamera } from "react-icons/hi";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  sendOtp,
  validateSignup,
} from "../services/operations/authAPI";

import { setSignupData } from "../slices/authSlice";

import DropDownModal from "../components/common/DropDownModal";
import Modal from "../components/common/Modal";

import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import SignupInstruction from "../components/common/SignupInstruction";

import logo from "../assets/confettiNoText.png";


const Signup = () => {

  // =====================================================
  // Redux
  // =====================================================

  const { token } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();


  // =====================================================
  // Local State
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [genderModal, setGenderModal] =
    useState(false);

  const [yearModal, setYearModal] =
    useState(false);

  const [branchModal, setBranchModal] =
    useState(false);

  const [isChecked, setIsChecked] =
    useState(false);

  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });


  // =====================================================
  // React Hook Form
  // =====================================================

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: {
      errors,
      isSubmitSuccessful,
    },
  } = useForm();


  // =====================================================
  // Terms & Conditions
  // =====================================================

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };


  // =====================================================
  // Signup Submit
  // =====================================================

  const handleSignup = async (data) => {

    if (!isChecked) {
      toast.error(
        "Please accept Terms & Conditions"
      );
      return;
    }

    setLoading(true);

    try {

      const values = getValues();


      // =================================================
      // Required Field Validation
      // =================================================

      if (!values.name?.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }

      if (!values.email?.trim()) {
        toast.error("Email is required");
        setLoading(false);
        return;
      }

      if (!values.username?.trim()) {
        toast.error("Username is required");
        setLoading(false);
        return;
      }

      if (!values.usn?.trim()) {
        toast.error("USN is required");
        setLoading(false);
        return;
      }

      if (!values.password) {
        toast.error("Password is required");
        setLoading(false);
        return;
      }

      if (!values.confirmPassword) {
        toast.error(
          "Confirm Password is required"
        );
        setLoading(false);
        return;
      }

      if (
        values.password !==
        values.confirmPassword
      ) {
        toast.error(
          "Password and Confirm Password do not match"
        );
        setLoading(false);
        return;
      }

      if (!values.gender) {
        toast.error("Please select Gender");
        setLoading(false);
        return;
      }


      // =================================================
      // Avatar File
      // =================================================

      const avatarFile =
        values.avatar instanceof File
          ? values.avatar
          : null;


      // =================================================
      // Store Avatar Temporarily
      // =================================================

      if (avatarFile) {

        const reader =
          new FileReader();

        await new Promise(
          (resolve, reject) => {

            reader.onload = () => {

              sessionStorage.setItem(
                "avatarBase64",
                reader.result
              );

              sessionStorage.setItem(
                "avatarName",
                avatarFile.name
              );

              sessionStorage.setItem(
                "avatarType",
                avatarFile.type
              );

              resolve();
            };

            reader.onerror = () => {
              reject(
                new Error(
                  "Failed to process avatar"
                )
              );
            };

            reader.readAsDataURL(
              avatarFile
            );
          }
        );

      } else {

        sessionStorage.removeItem(
          "avatarBase64"
        );

        sessionStorage.removeItem(
          "avatarName"
        );

        sessionStorage.removeItem(
          "avatarType"
        );
      }


      // =================================================
      // Signup Data
      // =================================================

      const signupData = {

        accountType: "Student",

        name: values.name.trim(),

        username:
          values.username.trim(),

        usn:
          values.usn.trim(),

        email:
          values.email.trim(),

        password:
          values.password,

        confirmPassword:
          values.confirmPassword,

        gender:
          values.gender,

        branch:
          values.branch || "",

        year:
          values.year || "",
      };


      // =================================================
      // Debug
      // =================================================

      console.log(
        "========== SIGNUP FORM DATA =========="
      );

      console.log({
        accountType:
          signupData.accountType,

        name:
          signupData.name,

        username:
          signupData.username,

        usn:
          signupData.usn,

        email:
          signupData.email,

        gender:
          signupData.gender,

        branch:
          signupData.branch,

        year:
          signupData.year,

        hasPassword:
          !!signupData.password,

        hasConfirmPassword:
          !!signupData.confirmPassword,

        hasAvatar:
          !!avatarFile,
      });


      // =================================================
      // Validate Signup
      // =================================================

      const verification =
        await dispatch(
          validateSignup(
            signupData.email,
            signupData.username,
            signupData.usn
          )
        );


      console.log(
        "VALIDATE SIGNUP RESULT:",
        verification
      );


      // =================================================
      // Send OTP
      // =================================================

      if (verification) {

        dispatch(
          setSignupData(
            signupData
          )
        );

        dispatch(
          sendOtp(
            signupData.email,
            navigate
          )
        );

      } else {

        // Validation failed
        setLoading(false);
      }

    } catch (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again."
      );

      setLoading(false);
    }
  };


  // =====================================================
  // Username Validation Pattern
  // =====================================================

  const [namePattern, setNamePattern] =
    useState(/^(?!.*name).*$/i);

  const name = watch("name");


  useEffect(() => {

    if (name) {

      setNamePattern(
        new RegExp(
          `^(?!.*${name}).*$`,
          "i"
        )
      );

    }

  }, [name]);


  // =====================================================
  // Reset Form
  // =====================================================

  useEffect(() => {

    if (isSubmitSuccessful) {

      reset({
        email: "",
        name: "",
        username: "",
        usn: "",
        password: "",
        confirmPassword: "",
        branch: "",
        year: "",
        avatar: null,
        gender: "",
      });

      setAvatar({
        file: null,
        url: "",
      });

      setIsChecked(false);
    }

  }, [
    isSubmitSuccessful,
    reset,
  ]);


  // =====================================================
  // Dropdown Data
  // =====================================================

  const gender = [
    "Male",
    "Female",
    "Other",
  ];

  const year = [
    "First",
    "Second",
    "Third",
    "Fourth",
  ];

  const branches = [
    "CS",
    "IS",
    "AD",
    "AI",
    "AT",
    "BT",
    "CH",
    "CI",
    "CY",
    "EC",
    "EE",
    "EI",
    "IM",
    "BA",
    "MC",
    "MD",
    "ME",
    "CV",
  ];


  // =====================================================
  // Avatar Handler
  // =====================================================

  const handleAvatar = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    // Basic image validation
    if (!file.type.startsWith("image/")) {

      toast.error(
        "Please select an image file"
      );

      return;
    }


    // Optional size limit: 5MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Avatar must be less than 5MB"
      );

      return;
    }


    const fileUrl =
      URL.createObjectURL(file);


    setAvatar({
      file,
      url: fileUrl,
    });


    setValue(
      "avatar",
      file,
      {
        shouldValidate: true,
      }
    );
  };


  // =====================================================
  // Redirect if already logged in
  // =====================================================

  useEffect(() => {

    if (token) {
      navigate("/feed");
    }

  }, [
    token,
    navigate,
  ]);


  // =====================================================
  // UI
  // =====================================================

  return (

    <Suspense fallback={<Loader />}>

      <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#0c0a20] to-[#18092b] text-white flex items-center justify-center p-4 md:p-8 overflow-hidden">

        {/* Ambient Glows */}

        <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>


        <div className="relative z-10 w-full max-w-4xl mx-auto my-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="p-6 md:p-10 bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl relative overflow-hidden"
          >

            {/* Instruction */}

            <div className="absolute top-6 right-6 z-20">
              <SignupInstruction />
            </div>


            {/* Header */}

            <div className="flex flex-col items-center mb-8">

              <div className="flex items-center gap-2 mb-2">

                <img
                  src={logo}
                  className="w-8 h-8 object-contain"
                  alt="WhisperPulse"
                />

                <span className="text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  WhisperPulse
                </span>

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Create Account
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Join your anonymous campus network today
              </p>

            </div>


            {/* Form */}

            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(
                handleSignup
              )}
            >

              {/* Avatar + Name + Email */}

              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">

                {/* Avatar */}

                <div className="flex flex-col items-center gap-2">

                  <label
                    htmlFor="file"
                    className="relative group cursor-pointer"
                  >

                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 shadow-xl shadow-amber-500/10 group-hover:scale-105 transition duration-200">

                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center relative">

                        {avatar.url ? (

                          <img
                            src={avatar.url}
                            className="w-full h-full object-cover rounded-full"
                            alt="Avatar Preview"
                          />

                        ) : (

                          <RxAvatar className="w-16 h-16 text-slate-400 group-hover:text-amber-300 transition" />

                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">

                          <HiCamera className="text-amber-400 text-2xl" />

                        </div>

                      </div>

                    </div>

                  </label>

                  <span className="text-xs text-amber-300 font-medium">
                    Upload Avatar
                  </span>

                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    className="hidden"
                    {...register("avatar")}
                    onChange={handleAvatar}
                  />

                </div>


                {/* Name + Email */}

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <SignUpInput
                    name="name"
                    value="name"
                    type="text"
                    error={errors?.name}
                    required={true}
                    register={() =>
                      register(
                        "name",
                        {
                          required:
                            "Name is required",

                          maxLength: {
                            value: 20,
                            message:
                              "Name should be under 20 chars",
                          },
                        }
                      )
                    }
                  />

                  <SignUpInput
                    name="email"
                    value="email"
                    type="email"
                    error={errors?.email}
                    required={true}
                    register={() =>
                      register(
                        "email",
                        {
                          required:
                            "Email is required",

                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

                            message:
                              "Invalid email format",
                          },
                        }
                      )
                    }
                  />

                </div>

              </div>


              {/* Username */}

              <div className="w-full">

                <SignUpInput
                  name="username"
                  value="username"
                  required={true}
                  type="text"
                  error={errors?.username}
                  register={() =>
                    register(
                      "username",
                      {
                        required:
                          "Username is required",

                        pattern:
                          namePattern,

                        maxLength: {
                          value: 15,
                          message:
                            "Username should be under 15 chars",
                        },
                      }
                    )
                  }
                />

              </div>


              {/* USN */}

              <div className="w-full">

                <SignUpInput
                  name="USN"
                  value="usn"
                  required={true}
                  type="text"
                  error={errors?.usn}
                  register={() =>
                    register(
                      "usn",
                      {
                        required:
                          "USN is required",

                        maxLength: {
                          value: 20,
                          message:
                            "USN should be under 20 characters",
                        },
                      }
                    )
                  }
                />

              </div>


              {/* Password */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <PasswordInput
                  name="password"
                  value="password"
                  type="password"
                  required={true}
                  error={errors?.password}
                  register={register}
                />

                <PasswordInput
                  name="Confirm Password"
                  value="confirmPassword"
                  type="password"
                  error={
                    errors?.confirmPassword
                  }
                  required={true}
                  register={register}
                />

              </div>


              {/* Gender / Branch / Year */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

                <DropDownModal
                  setModal={
                    setGenderModal
                  }
                  name="Gender"
                  showModal={
                    genderModal
                  }
                  getValues={
                    getValues
                  }
                />

                <DropDownModal
                  setModal={
                    setBranchModal
                  }
                  name="Branch"
                  showModal={
                    branchModal
                  }
                  getValues={
                    getValues
                  }
                />

                <DropDownModal
                  setModal={
                    setYearModal
                  }
                  name="Year"
                  showModal={
                    yearModal
                  }
                  getValues={
                    getValues
                  }
                />

              </div>


              {/* Terms */}

              <div className="flex items-center gap-3 pt-2">

                <input
                  id="termsAndConditions"
                  type="checkbox"
                  checked={isChecked}
                  onChange={
                    handleCheckboxChange
                  }
                  className="w-4 h-4 text-amber-400 bg-white/5 border-white/20 rounded focus:ring-amber-400 focus:ring-offset-0 cursor-pointer"
                />

                <label
                  htmlFor="termsAndConditions"
                  className="text-xs text-slate-300 cursor-pointer"
                >

                  Accept our{" "}

                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(
                        "/terms-and-conditions"
                      );
                    }}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Terms & Conditions
                  </span>

                  {" "}to proceed further.

                </label>

              </div>


              {/* Submit */}

              <div className="pt-2">

                <SubmitButton
                  disabled={
                    !isChecked ||
                    loading
                  }
                  text={
                    isChecked
                      ? "Sign Up & Verify OTP 🚀"
                      : "Accept T&C to proceed"
                  }
                  type="submit"
                  customClasses="w-full"
                />

              </div>


              {/* Login */}

              <div className="text-center text-xs text-slate-400 mt-2">

                Already have an account?{" "}

                <span
                  onClick={() =>
                    navigate("/")
                  }
                  className="text-amber-400 font-semibold hover:underline cursor-pointer"
                >
                  Log In Here
                </span>

              </div>

            </form>

          </motion.div>

        </div>


        {/* Gender Modal */}

        {genderModal && (
          <Modal
            data={gender}
            name="Gender"
            value="gender"
            error={errors?.gender}
            register={register}
            required={false}
            setModal={
              setGenderModal
            }
          />
        )}


        {/* Branch Modal */}

        {branchModal && (
          <Modal
            data={branches}
            name="Branch"
            value="branch"
            setModal={
              setBranchModal
            }
            error={errors?.branch}
            required={false}
            register={register}
          />
        )}


        {/* Year Modal */}

        {yearModal && (
          <Modal
            data={year}
            name="Year"
            value="year"
            setModal={
              setYearModal
            }
            error={errors?.year}
            required={true}
            register={register}
          />
        )}

      </div>

    </Suspense>
  );
};


export default Signup;
