import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
/* Hi here stands for Hero Icons */
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

import { app } from "../../firebase.js";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../redux/user/userSlice.js";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  /* imageFileUrl is a temporary URL we create with "URL.createObjectURL()", which if we refresh the page will revert back to our image saved in our DB, this is 'cause this temporary URL is only for UI purpose */
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [userUpdateSuccessful, setUserUpdateSuccessful] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      /* createObjectURL() will create a URL for our file */
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  /* uploads the new image that we have chosen to the DB */
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    /* setting setImageFileUploadError(null) at the beginning here ensures that the error alert for the previous wrong upload gets erased before the new upload process */
    setImageFileUploadError(null);
    /* app comes from firebase.js. 'cause of this "app", firebase will understand that the request to upload the images is from the authorized */
    const storage = getStorage(app);
    /* 'cause imageFile.name is not unique since a user may try to upload the same image twice, which will lead to an error in the DB, as it will not accept. To evade this, we add "new Date().getTime() to make it unique" */
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    /* uploadTask represents the process of uploading an object. Allows you to monitor and manage the upload */
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    /* uploadTask.on() listens for events on this task */
    /* snapshot represents a snapshot of the current task state */
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        /* progess represents the percentage of the upload process */
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        /* progress is a decimal value by default, so in order to round it off to the nearest whole number, we use "toFixed(0)" */
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image. Your file must be less than 2MB!"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      /* getting the file URL */
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* we're are setting these states to their default to ensure that there are no messages shown to the user regarding the previous state changes whilst uploading again */
    setUserUpdateError(null);
    setUserUpdateSuccessful(null);
    /* we're checking if the formdata is empty and if it is then we don't submit the form */
    if (Object.keys(formData).length === 0) {
      setUserUpdateError("No changes made!");
      return;
    }

    /* this ensures that updating the profile whilst the image is still being uploaded is not possible  */
    if (imageFileUploading) {
      setUserUpdateError("Please wait for the image to upload!");
      return;
    }

    try {
      dispatch(updateStart());

      const resp = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();

      if (!resp.ok) {
        dispatch(updateFailure(data.message));
        setUserUpdateError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateSuccessful("Your profile has been updated successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUserUpdateError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const resp = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await resp.json();

      if (!resp.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    /* 'cause we're not sending any files, we don't have to have any headers */
    try {
      const resp = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await resp.json();

      if (!resp.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* self-center won't work if its parent element i.e., form doesn't have flex */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* uploading animation */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-4"
          onClick={() => filePickerRef.current.click()}
        >
          {/* if the imageFileUploadProgress is between 0 to 100, show the progress animation */}
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  /* the opacity of the progress bar depends on the percentage with these rules. When the progress is 100%, then 100 / 100 would be 1, so opacity will be set to 1 */
                  stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            /* currentUser.profilePicture is the image saved in our DB and imageFileUrl is the temporary URL which we have created for the chosen image (as a preview) that we are about to upload */
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-3 object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientMonochrome="teal"
          outline
          className="font-semibold"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading" : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientMonochrome="teal"
              className="w-full font-semibold"
            >
              Create post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between my-3">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {userUpdateSuccessful && (
        <Alert color="success" className="mt-5">
          {userUpdateSuccessful}
        </Alert>
      )}
      {userUpdateError && (
        <Alert color="failure" className="mt-5">
          {userUpdateError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-300">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="grey" onClick={() => setShowModal(null)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
