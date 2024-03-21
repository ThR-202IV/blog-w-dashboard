import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { app } from "../../firebase.js";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
  /* app is from firebase.js */
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    /* this ensures that Google always asks us which account we must log in instead of it choosing our previous option */
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const resp = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await resp.json();

      if (resp.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* type is button 'cause we don't want to submit our form when we click this */
  return (
    <Button type="button" outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-1" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
