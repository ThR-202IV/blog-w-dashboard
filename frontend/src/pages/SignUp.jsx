import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    /* trim() is added to remove whitespaces */
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields!");
    }

    try {
      setLoading(true);
      /* setting it to null as we want to clear the error in case we had one from a previous request */
      setErrorMessage(null);
      /* 'cause we're reaching out to the server which is in localhost:3000, we must have localhost: 3000 in front of this address as well, which we have added in "vite.config.js" file */
      const resp = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      /* the error that comes from data is from the general error handling middleware we set up in index.js */
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);

      if (resp.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className=" text-slate-400">
              Code<span className="text-slate-700 p-1">——</span>Prime
            </span>
          </Link>
          <p className="text-sm mt-5">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
            quasi nostrum voluptas temporibus neque nobis ceat iure, maxime
            ommodi ut quidem doloribus, labore aboriosam blanditiis est eum illo
            esse non.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label
                value="Username"
                className="font-semibold text-slate-600"
              />
              <TextInput
                type="text"
                id="username"
                onChange={handleChange}
                className="mt-2"
              ></TextInput>
            </div>
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
                "Sign up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-teal-700">
              Sign in
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

export default SignUp;
