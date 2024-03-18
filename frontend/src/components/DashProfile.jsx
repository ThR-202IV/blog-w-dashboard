import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { app } from "../../firebase.js";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  /* imageFileUrl is a temporary URL we create with "URL.createObjectURL()", which if we refresh the page will revert back to our image saved in our DB, this is 'cause this temporary URL is only for UI purpose */
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

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
      },
      /* getting the file URL */
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* self-center won't work if its parent element i.e., form doesn't have flex */}
      <form className="flex flex-col gap-4">
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
            /* currentUser.profilePicture is the image saved in our DB and imageFileUrl is the temporary URL which we have created for the chosen image that we are about to upload */
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
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between my-3">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <div className="text-slate-500 flex"></div>
    </div>
  );
};

export default DashProfile;
