import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

/* 'cause we're using Footer element of flowbite, we cant have this component named Footer as well 'cause of name clashes */
const FooterComp = () => {
  return (
    <Footer container className="border-t  border-teal-400">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-2">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="text-slate-400">
                Code<span className="text-slate-700 p-1">——</span>Prime
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-3 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                {/* target="_blank" opens a new window & rel="noopener noreferrer" allows the external site to be opened without the browser asking questions annd blocking the new window */}
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  About us
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  FAQs
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow" />
              <Footer.LinkGroup col>
                {/* target="_blank" opens a new window & rel="noopener noreferrer" allows the external site to be opened without the browser asking questions annd blocking the new window */}
                <Footer.Link
                  href="https://github.com/ThR-202IV"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                {/* target="_blank" opens a new window & rel="noopener noreferrer" allows the external site to be opened without the browser asking questions annd blocking the new window */}
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full ">
          <Footer.Copyright
            // href="#"
            by="Code —— Prime"
            /* change year dynamically */
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-4 sm:mt-4  sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon
              href="https://github.com/ThR-202IV"
              target="_blank"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
