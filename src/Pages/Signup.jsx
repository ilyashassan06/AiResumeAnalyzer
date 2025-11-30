import React from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { useTheme } from "../Context/ThemeContext";
import { auth, db } from "../Context/firebaseConfig";

function Signup() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1) Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2) Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: data.username,
        email: data.email,
        createdAt: new Date(),
        role: "basicUser",
      });

      navigate("/home");
      alert("Signup successful!");
      reset();
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message);
    }
  };

  return (
    <div
      className={
        theme === "light"
          ? "min-h-screen flex items-center w-[100%] justify-center bg-gray-50 px-4 py-12"
          : "min-h-screen flex items-center w-[100%] justify-center bg-gray-900 px-4 py-12"
      }
    >
      <div
        className={
          theme === "light"
            ? "w-full max-w-lg mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10"
            : "w-full max-w-md mx-auto bg-gray-800/70 backdrop-blur-sm border border-gray-700 p-8 rounded-3xl shadow-lg"
        }
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1
            className={
              theme === "light"
                ? "text-4xl sm:text-5xl font-extrabold text-gray-800"
                : "text-4xl sm:text-5xl font-extrabold text-gray-100"
            }
          >
            AI Resume Analyzer
          </h1>
          <p
            className={
              theme === "light"
                ? "mt-2 text-sm text-gray-500"
                : "mt-2 text-sm text-gray-300"
            }
          >
            Create your account to get personalized insights
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              className={
                theme === "light"
                  ? "block text-sm font-medium text-gray-700 mb-2"
                  : "block text-sm font-medium text-gray-200 mb-2"
              }
            >
              Username
            </label>
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters required" },
              })}
              placeholder="e.g. JohnDoe"
              autoComplete="username"
              className={
                theme === "light"
                  ? "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-shadow"
                  : "w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
              }
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-2">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className={
                theme === "light"
                  ? "block text-sm font-medium text-gray-700 mb-2"
                  : "block text-sm font-medium text-gray-200 mb-2"
              }
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
              placeholder="example@mail.com"
              autoComplete="email"
              className={
                theme === "light"
                  ? "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-shadow"
                  : "w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
              }
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={
                theme === "light"
                  ? "block text-sm font-medium text-gray-700 mb-2"
                  : "block text-sm font-medium text-gray-200 mb-2"
              }
            >
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/,
                  message: "Must include uppercase, number & special character",
                },
              })}
              placeholder="••••••••"
              autoComplete="new-password"
              className={
                theme === "light"
                  ? "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-shadow"
                  : "w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
              }
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-2">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={
                theme === "light"
                  ? "w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                  : "w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-3 rounded-xl shadow-md transition-all"
              }
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 h-px" style={{ backgroundColor: theme === "light" ? "rgba(17,24,39,0.05)" : "rgba(255,255,255,0.06)" }}></div>
            <span className={theme === "light" ? "px-3 text-sm text-gray-500" : "px-3 text-sm text-gray-300"}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme === "light" ? "rgba(17,24,39,0.05)" : "rgba(255,255,255,0.06)" }}></div>
          </div>

          {/* Footer */}
          <div className="text-center mt-2">
            <p className={theme === "light" ? "text-sm text-gray-500" : "text-sm text-gray-300"}>
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 hover:text-amber-500 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
