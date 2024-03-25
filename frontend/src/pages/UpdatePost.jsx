import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { app } from "../../firebase.js";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const resp = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await resp.json();
        if (!resp.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          /* 'cause it returns an array, we get the first element although only one element is returned in the array */
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      /* we must have a file name that is unique */
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          /* the progress is a decimal number, therefore we make it a whole number by adding '.toFixed(0)' */
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed!");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            /* ImageUploadProgress is set to null 'cause it is after the upload */
            setImageUploadProgress(null);
            setImageUploadError(null);
            /* we keep the rest of the other formData and add the downloadUrl */
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed!");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Edit post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title}
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            {/* values must be in lowercase */}
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="react">React</option>
            <option value="nodejs">Node.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ">
          <FileInput
            type="file"
            accept=" image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientMonochrome="teal"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="h-16 w-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="hero-image"
            className="w-full h-72 object-cover"
          />
        )}
        {/* we altered certain settings of the default value for better UI. check index.css */}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Type here"
          className="h-72 mb-12"
          required
          /* this is how you get the information from ReactQuill */
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          gradientMonochrome="teal"
          className="font-semibold mb-5"
        >
          Update
        </Button>
        {publishError && (
          <Alert color="failure" className="mt-5 mb-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
