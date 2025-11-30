import React from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { auth } from "../Context/firebaseConfig";

function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Email/Password Login (logic unchanged)
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

  return (
    <div
      className={
        theme === "light"
          ? "min-h-screen flex items-center justify-center w-[100%] bg-gray-50 px-4 py-12"
          : "min-h-screen flex items-center justify-center w-[100%] bg-gray-900 px-4 py-12"
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
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
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
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              placeholder="••••••••"
              autoComplete="current-password"
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-2">
            <p className={theme === "light" ? "text-sm text-gray-500" : "text-sm text-gray-300"}>
              Don’t have an account?{" "}
              <Link to="/Signup" className="text-amber-600 hover:text-amber-500 font-medium">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
