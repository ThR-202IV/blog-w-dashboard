import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
/* in order to make your navigation links active when they correspond with the URL, we use useLocation */
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  /* in order to make your navigation links active when they correspond with the URL, we use useLocation */
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-2 text-slate-400">
          Code<span className="text-slate-700 p-1">——</span>Prime
        </span>
      </Link>
      {/* 'cause we submit a search request, we need a form */}
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="grey" pill>
        <AiOutlineSearch />
      </Button>
      {/* with md:order-2 we are able to place the button before the hamburger menu in medium breakpoint and above */}
      {/* see: https://www.devwares.com/tailwindcss/classes/tailwind-order/ */}
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline " color="grey" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button gradientMonochrome="teal" outline>
            Sign In
          </Button>
        </Link>
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
