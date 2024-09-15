import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ArrowDownIcon,ArrowSmallDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-[#145182]",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-black-100 overflow-y-auto`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <h6 className="text-base text-[#145182] font-semibold block antialiased tracking-normal leading-relaxed font-sans">
            {brandName}
          </h6>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute left-5 top-5   grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={3.5} className="h-6 w-6 text-[#145182]" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages,dropdown }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "black"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, dropdown }) => (
              <li key={name}>
                {dropdown ? (
                  <div className="relative">
                    <Button
                      variant="text"
                      color={sidenavType === "dark" ? "white" : "black"}
                      className="flex items-center gap-4 px-4 capitalize "
                      fullWidth
                      onClick={() => handleDropdownToggle(name)}
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                      <IconButton
                        variant="text"
                        color="white"
                        size="sm"
                        ripple={false}
                        className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none  "
                        onClick={() => setOpenSidenav(dispatch, false)}
                      >
                       {/* <svg className="absolute top-1/4 -translate-y-1/4 right-2 z-50" width="24" height="24"
                                    viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#145182" strokeWidth="1.6"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg> */}
                   
                      </IconButton>
                    </Button>
                    {activeDropdown === name && (
                      <ul className="top-full w-5/6 ml-10 z-10 bg-[#145182] shadow-md text-white rounded-md py-1 ">
                        {dropdown.map(({ name: dropdownName, path: dropdownPath }) => (
                          <li key={dropdownName} className="">
                            <NavLink to={`/${layout}${dropdownPath}`}>
                              <Button
                                variant="text"
                                color="black"
                                className="flex items-center px-4 capitalize "
                                fullWidth
                              >
                                <Typography color="inherit" className="text-white font-semibold">{dropdownName}</Typography>
                              </Button>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink to={`/${layout}${path}`}>
                    <Button
                      variant="text"
                      color={sidenavType === "dark" ? "white" : "black"}
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/rentspace.png",
  brandName: "RentSpace",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
