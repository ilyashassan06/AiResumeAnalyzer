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
    <div className="flex justify-center flex-col gap-6 items-center min-h-screen s">
      <h1 className="text-6xl text-white">AI Resume Analyzer</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl w-[90%] sm:w-[400px]"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
          Welcome Back 👋
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
            autoComplete="email" // ✅ Add this
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-2">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-300 mb-2">
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
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/30"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* Google Login --- under bug fix */}
        {/* <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white/90 text-gray-800 font-semibold py-3 rounded-xl hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button> */}

        {/* Footer */}
        <p className="text-gray-400 text-center mt-6 text-sm">
          Don’t have an account?{" "}
         <Link
  to="/Signup"
  className="text-indigo-400 hover:text-indigo-300 transition-all"
>
 Signup
</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
