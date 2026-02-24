import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";


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
      await puter.auth.signUp({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      alert("Signup Successful!");
      navigate("/home");
      reset();
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.message || "Signup failed");
    }
  };

  return (
    <div className={theme === "light"
      ? "min-h-screen flex items-center w-[100%] justify-center bg-gray-50 px-4 py-12"
      : "min-h-screen flex items-center w-[100%] justify-center bg-gray-900 px-4 py-12"}>

      <div className={theme === "light"
        ? "w-full max-w-lg bg-transparent shadow-xl rounded-3xl p-8"
        : "w-full max-w-md bg-gray-800 border border-gray-700 p-8 rounded-3xl"}>

        <h1 className="text-4xl font-extrabold text-center">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">

          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            {...register("username", { required: "Username required" })}
            className="w-full px-4 py-3 rounded-xl bg-gray-100"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...register("email", { required: "Email required" })}
            className="w-full px-4 py-3 rounded-xl bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register("password", { required: "Password required" })}
            className="w-full px-4 py-3 rounded-xl bg-gray-100"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 text-white py-3 rounded-xl">
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-sm">
            Already have account?{" "}
            <Link to="/login" className="text-amber-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;