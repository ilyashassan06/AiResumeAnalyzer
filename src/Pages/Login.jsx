import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, provider } from "../Context/firebaseConfig";
import { getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";


function Login() {
 const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Email/Password Login
  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      alert("Login Successful!");
        navigate("/Home");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  };

  // Google Login
  // const handleGoogleLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, provider);
  //     alert("Logged in with Google!");
  //      navigate("/Home");
  //   } catch (error) {
  //     console.error("Google Login Error:", error.message);
  //     alert("Google login failed!");
  //   }
  // };


  return (
    <div className="flex justify-center flex-col gap-6 items-center min-h-screen   text-white px-4">
      {/* Page Title */}
      <h1 className="text-5xl w-full text-center sm:text-6xl text-black font-extrabold drop-shadow-md">
        AI Resume Analyzer
      </h1>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800
 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white mb-2">
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
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="••••••••"
            autoComplete="current-password"
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
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* OR Divider */}
        {/* <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="px-3 text-gray-200 text-sm">or</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div> */}

        {/* Google Login (optional) */}
        {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white text-gray-800 font-semibold py-3 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-200 transition-all duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button> */}

        {/* Footer */}
        <p className="text-gray-200 text-center mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/Signup"
            className="text-amber-300 hover:text-amber-200 transition-all"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
