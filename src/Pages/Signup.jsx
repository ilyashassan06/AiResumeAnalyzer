import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, provider, } from "../Context/firebaseConfig"; // make sure you have firebase.js setup
import { createUserWithEmailAndPassword, getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Context/firebaseConfig"; // import Firestore


function Signup() {
   const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // ✅ Email/Password Signup


const onSubmit = async (data) => {
  try {
    // 1️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // 2️⃣ Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: data.username,
      email: data.email,
      createdAt: new Date(),
      role: "basicUser",
    });
navigate("/home");
    alert("Signup successful!");
  } catch (error) {
    console.error("Signup Error:", error);
    alert(error.message);
  }
};


  // ✅ Google Signup
  // const handleGoogleSignup = async () => {
  //   try {
  //     await signInWithPopup(auth, provider);
     
  //   } catch (error) {
  //     console.error("Google Signup Error:", error.message);
  //     alert("Google signup failed!");
  //   }
  // };

 

  return (
     <div className="flex justify-start mt-10 flex-col gap-6 items-center min-h-screen   text-white px-4">
      {/* Page Title */}
      <h1 className="text-5xl text-center text-black md:text-6xl font-extrabold drop-shadow-md">
        AI Resume Analyzer
      </h1>

      {/* Sign Up Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800

 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
          Create Your Account
        </h2>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white  mb-2">
            Username
          </label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "At least 3 characters required",
              },
            })}
            placeholder="e.g. JohnDoe"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-2">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white  mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            placeholder="example@mail.com"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-2">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-white  mb-2">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
                message:
                  "Must include uppercase, number & special character",
              },
            })}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-200"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="px-3 text-gray-200 text-sm">or</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Google Signup (optional) */}
        {/* <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-white text-gray-800 font-semibold py-3 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-200 transition-all duration-200"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign Up with Google
        </button> */}

        {/* Footer */}
        <p className="text-gray-200 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-300 hover:text-amber-200 transition-all"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
