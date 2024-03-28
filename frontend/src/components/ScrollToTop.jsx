/* without this component, every time we click on the username in the CommentSection.jsx, we would land on the '/dashboard?tab=profile' page at the bottom of the page and this is bad UI. This ensures that we always land on the top of the page */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
