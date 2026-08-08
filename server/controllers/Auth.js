const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const { cloudinaryConnect } = require("../configs/cloudinary");
const welcomeTemplate = require("../mail/templates/newJoining");

const admin = require("firebase-admin");


// ======================================================
// FIREBASE INITIALIZATION
// ======================================================

if (!admin.apps?.length) {
  const serviceAccount = require(
    "../configs/firebase-admin-config"
  );

  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount
    ),
  });
}


// ======================================================
// SEND JOINING EMAIL
// ======================================================

async function sendJoiningEmail(email, name) {
  try {
    const mailResponse = await mailSender(
      email,
      "Welcome to WhisperPulse",
      welcomeTemplate(name)
    );

    console.log(
      "Joining email sent successfully:",
      mailResponse?.messageId
    );

    return mailResponse;

  } catch (error) {
    console.error(
      "Error occurred while sending joining email:",
      error
    );

    // Don't fail signup only because welcome email failed
    return null;
  }
}


// ======================================================
// SEND OTP
// ======================================================

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();


    // Check existing user
    const checkUserPresent =
      await User.findOne({
        email: normalizedEmail,
      });

    if (checkUserPresent) {
      return res.status(415).json({
        success: false,
        message: "User already registered",
      });
    }


    // Generate 6 digit OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });


    // Make sure same OTP is not already present
    let result = await OTP.findOne({
      otp: otp,
    });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({
        otp: otp,
      });
    }


    // Create OTP
    const otpPayload = {
      email: normalizedEmail,
      otp: otp,
    };

    await OTP.create(otpPayload);


    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(
      "Error while sending OTP:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to send OTP",
    });
  }
};


// ======================================================
// SIGNUP
// ======================================================

exports.signup = async (req, res) => {
  try {

    const {
      usn,
      username,
      password,
      confirmPassword,
      gender,
      branch,
      year,
      email,
      accountType,
      otp,
    } = req.body;


    // Name
    let name = req.body.name;

    if (typeof name !== "string") {
      return res.status(403).json({
        success: false,
        message: "Name is required",
      });
    }

    name = name.trim();

    if (!name) {
      return res.status(403).json({
        success: false,
        message: "Name is required",
      });
    }

    name = name.toLowerCase();


    // Normalize values
    const normalizedEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : "";

    const normalizedUsername =
      typeof username === "string"
        ? username.trim()
        : "";

    const normalizedUsn =
      typeof usn === "string"
        ? usn.trim()
        : "";


    // Avatar
    const avatar =
      req?.files?.avatar;


    // ==================================================
    // Required fields
    // ==================================================

    if (
      !password ||
      !confirmPassword ||
      !normalizedEmail ||
      !gender ||
      !normalizedUsername ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Some fields are required!!",
      });
    }


    // ==================================================
    // Password validation
    // ==================================================

    if (
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match, try again",
      });
    }


    // ==================================================
    // Check existing email
    // ==================================================

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already registered",
      });
    }


    // ==================================================
    // Check existing username
    // ==================================================

    const existingUsername =
      await User.findOne({
        username: normalizedUsername,
      });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message:
          "Username is already registered",
      });
    }


    // ==================================================
    // Check existing USN
    // ==================================================

    if (normalizedUsn) {
      const existingUsn =
        await User.findOne({
          usn: normalizedUsn,
        });

      if (existingUsn) {
        return res.status(400).json({
          success: false,
          message:
            "USN is already registered",
        });
      }
    }


    // ==================================================
    // Verify OTP
    // ==================================================

    const recentOtp =
      await OTP.find({
        email: normalizedEmail,
      })
        .sort({
          createdAt: -1,
        })
        .limit(1);


    if (
      recentOtp.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP NOT FOUND",
      });
    }


    if (
      otp.toString() !==
      recentOtp[0].otp.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }


    // ==================================================
    // Hash Password
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ==================================================
    // Upload Avatar
    // ==================================================

    let avatarUrl = "";


    if (avatar) {
      try {

        cloudinaryConnect();

        const result =
          await uploadImageToCloudinary(
            avatar,
            process.env.FOLDER_NAME,
            1000,
            1000
          );

        avatarUrl =
          result.secure_url;

      } catch (error) {

        console.error(
          "FILE COULD NOT BE UPLOADED:",
          error
        );

        // Continue signup with default avatar
        avatarUrl = "";
      }

    }


    // ==================================================
    // Default Avatar
    // ==================================================

    if (!avatarUrl) {

      const firstName =
        name.split(" ")[0] || "User";

      avatarUrl =
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          firstName
        )}`;
    }


    // ==================================================
    // Create User
    // ==================================================

    const user =
      await User.create({
        name,

        usn: normalizedUsn,

        username:
          normalizedUsername,

        email:
          normalizedEmail,

        password:
          hashedPassword,

        accountType:
          accountType || "Student",

        displayPicture:
          avatarUrl,

        branch:
          branch || undefined,

        year:
          year || undefined,

        gender,
      });


    // ==================================================
    // Send Welcome Email
    // ==================================================

    sendJoiningEmail(
      normalizedEmail,
      user.name
    );


    // ==================================================
    // Remove used OTP
    // ==================================================

    try {
      await OTP.deleteMany({
        email: normalizedEmail,
      });
    } catch (otpDeleteError) {
      console.error(
        "Could not delete OTP:",
        otpDeleteError
      );
    }


    // ==================================================
    // Response
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Sign up Successful",
      user,
    });

  } catch (error) {

    console.error(
      "Error in signing up:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "User cannot be registered, please try again",
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

exports.login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // Validate
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message:
          "All fields are required, please try again",
      });
    }


    const normalizedEmail =
      email.trim().toLowerCase();


    // Find user
    const user =
      await User.findOne({
        email: normalizedEmail,
      }).populate(
        "notifications"
      );


    if (!user) {
      return res.status(415).json({
        success: false,
        message:
          "User does not exist, Sign up first please",
      });
    }


    // Check password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return res.status(415).json({
        success: false,
        message:
          "Password is incorrect",
      });
    }


    // JWT payload
    const payload = {
      email: user.email,
      id: user._id,
      accountType:
        user.accountType,
    };


    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    // Save token
    user.token = token;

    user.password = undefined;


    // Cookie
    const options = {
      expires: new Date(
        Date.now() +
          3 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };


    res
      .cookie(
        "token",
        token,
        options
      )
      .status(200)
      .json({
        success: true,
        token,
        user,
        message:
          "Logged in successfully",
      });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login Failure, please try again",
    });
  }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

exports.changePassword = async (
  req,
  res
) => {

  try {

    const {
      oldPassword,
      newPassword,
      userId,
    } = req.body;


    const uid =
      userId || req.user.id;


    const userDetails =
      await User.findById(uid);


    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // Validate old password
    const isPasswordMatch =
      await bcrypt.compare(
        oldPassword,
        userDetails.password
      );


    if (!isPasswordMatch) {
      return res.status(415).json({
        success: false,
        message:
          "The password is incorrect",
      });
    }


    // Hash new password
    const encryptedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    const updatedUserDetails =
      await User.findByIdAndUpdate(
        uid,
        {
          password:
            encryptedPassword,
        },
        {
          new: true,
        }
      );


    if (!updatedUserDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // Send password update email
    try {

      await mailSender(
        updatedUserDetails.email,
        "Password Updated - WhisperPulse",
        passwordUpdated(
          updatedUserDetails.email,
          "Password updated successfully"
        )
      );

    } catch (error) {

      console.error(
        "Error occurred while sending email:",
        error
      );

      // Don't fail password update
      // because email failed
    }


    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });

  } catch (error) {

    console.error(
      "Error occurred while updating password:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error occurred while updating password",
      error: error.message,
    });
  }
};


// ======================================================
// VALIDATE SIGNUP
// ======================================================

exports.validateSignup = async (
  req,
  res
) => {

  try {

    const {
      email,
      username,
      usn,
    } = req.body;


    if (
      !email ||
      !username ||
      !usn
    ) {
      return res.status(400).json({
        success: false,
        flag: false,
        message:
          "Email, username and USN are required",
      });
    }


    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedUsername =
      username.trim();

    const normalizedUsn =
      usn.trim();


    // Check email
    const checkUserPresent =
      await User.findOne({
        email: normalizedEmail,
      });


    if (checkUserPresent) {
      return res.status(200).json({
        success: true,
        flag: false,
        message:
          "User already registered with this email",
      });
    }


    // Check username
    const checkUsername =
      await User.findOne({
        username:
          normalizedUsername,
      });


    if (checkUsername) {
      return res.status(200).json({
        success: true,
        flag: false,
        message:
          "Username already taken",
      });
    }


    // Check USN
    const checkUsn =
      await User.findOne({
        usn: normalizedUsn,
      });


    if (checkUsn) {
      return res.status(200).json({
        success: true,
        flag: false,
        message:
          "USN already registered",
      });
    }


    return res.status(200).json({
      success: true,
      flag: true,
      message:
        "User can be registered",
    });

  } catch (error) {

    console.error(
      "Error while validating signup:",
      error
    );

    return res.status(500).json({
      success: false,
      flag: false,
      message:
        error.message ||
        "Signup validation failed",
    });
  }
};
