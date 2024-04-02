import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
/* in order to make your navigation links active when they correspond with the URL, we use useLocation */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signOutSuccess } from "../redux/user/userSlice.js";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* in order to make your navigation links active when they correspond with the URL, we use useLocation */
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  /* search is available in location by default, it is all the data inside the location */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    /* this is to ensure that we change the URL search term when we type it in the search bar —— that is, it matches the search bar */
    const urlParams = new URLSearchParams(location.search);
    /* here we set the URL searchTerm with the search term state we have created, which changes with user input */
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-2 text-slate-400">
          Code<span className="text-slate-700 p-1 dark:text-slate-300">——</span>
          Prime
        </span>
      </Link>
      {/* 'cause we submit a search request, we need a form */}
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="grey" pill>
        <AiOutlineSearch />
      </Button>
      {/* with md:order-2 we are able to place the button before the hamburger menu in medium breakpoint and above */}
      {/* see: https://www.devwares.com/tailwindcss/classes/tailwind-order/ */}
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="grey"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientMonochrome="teal" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {/* in order to prevent this error: "<a> cannot appear as a descendant of <a>", which is caused by Navbar.Link and Link inside it producing an <a> of their own, we use "as={"div"}" */}
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
