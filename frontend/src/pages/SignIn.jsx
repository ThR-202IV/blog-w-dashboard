import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  /* in state.user, the user denotes the name key in userSlice: name: "user" */
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    /* trim() is added to remove whitespaces */
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("All fields are required!"));
    }

    try {
      dispatch(signInStart());
      /* 'cause we're reaching out to the server which is in localhost:3000, we must have localhost: 3000 in front of this address as well, which we have added in "vite.config.js" file */
      const resp = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();

      if (data.success === false) {
        /* data.message becomes the action.payload in state.error of signInFailure in userSlice.jsx */
        dispatch(signInFailure(data.message));
      }

      if (resp.ok) {
        /* data becomes the action.payload in state.currentUser of signInSuccess in userSlice.jsx */
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-8">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className=" text-slate-400">
              Code
              <span className="text-slate-700 p-1 dark:text-slate-300">——</span>
              Prime
            </span>
          </Link>
          <p className="text-sm mt-5">
            Code —— Prime is home for programming stories and ideas. Here, you
            can find insightful perspectives, useful knowledge, and everything
            about and related to the coding world.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" className="font-semibold text-slate-600" />
              <TextInput
                type="email"
                id="email"
                onChange={handleChange}
                className="mt-2"
              ></TextInput>
            </div>
            <div>
              <Label
                value="Password"
                className="font-semibold text-slate-600"
              />
              <TextInput
                type="password"
                id="password"
                onChange={handleChange}
                className="mt-2"
              ></TextInput>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-teal-700">
              Sign up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
