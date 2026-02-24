import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";


function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await window.puter.auth.signIn();

      alert("Login Successful!");
      navigate("/Home");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className={theme === "light"
      ? "min-h-screen flex items-center justify-center w-[100%] bg-gray-50 px-4 py-12"
      : "min-h-screen flex items-center justify-center w-[100%] bg-gray-900 px-4 py-12"}>

      <div className={theme === "light"
        ? "w-full max-w-lg mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10"
        : "w-full max-w-md mx-auto bg-gray-800/70 backdrop-blur-sm border border-gray-700 p-8 rounded-3xl shadow-lg"}>

        <h1 className={theme === "light"
          ? "text-4xl font-extrabold text-gray-800 text-center"
          : "text-4xl font-extrabold text-gray-100 text-center"}>
          AI Resume Analyzer
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-3 rounded-xl bg-gray-100"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-3 rounded-xl bg-gray-100"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 text-white py-3 rounded-xl">
            {isSubmitting ? "Logging in..." : "Continue with puter"}
          </button>

         
        </form>
      </div>
    </div>
  );
}

export default Login;