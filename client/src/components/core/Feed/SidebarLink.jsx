import * as Icons from "react-icons/vsc";
import { FaTrophy } from "react-icons/fa";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import "./sidebar.css";
import { memo } from "react";

const SidebarLink = memo(function SideBarLink({ link, iconName }) {
  let Icon = Icons[iconName];
  if (!Icon) {
    if (iconName === "FaTrophy" || iconName === "VscTrophy") {
      Icon = FaTrophy;
    } else {
      Icon = Icons["VscFlame"] || Icons["VscDashboard"];
    }
  }

  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      className={`relative px-6 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-x-3 ${
        isActive
          ? "bg-amber-100/70 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold"
          : "text-gray-700 dark:text-gray-300 hover:bg-amber-50/50 dark:hover:bg-gray-800/50"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.25rem] bg-amber-500 rounded-r-md transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      ></span>

      {Icon && <Icon className={`text-xl ${isActive ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`} />}
      <span>{link.name}</span>
    </NavLink>
  );
});

export default SidebarLink;