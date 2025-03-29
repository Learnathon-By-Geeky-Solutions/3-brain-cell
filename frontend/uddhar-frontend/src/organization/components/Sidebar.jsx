import React, { useState } from "react";
import {
  MdDashboard,
  MdFlood,
  MdOutlineFlood,
  MdOutlineForwardToInbox,
  MdOutlineLogout,
  MdOutlineSettings,
} from "react-icons/md";
import { IoAnalytics } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import { GrGroup } from "react-icons/gr";

function Sidebar() {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const upperPart = [
    { label: "Dashboard", icon: <MdDashboard />, href: "/dashboard/organization" },
    { label: "Analytics", icon: <IoAnalytics />, href: "/dashboard/organization/analytics" },
    { label: "Reporting", icon: <TbReportSearch />, href: "/dashboard/organization/reporting" },
    { label: "Member List", icon: <GrGroup />, href: "/member-list" },
    { label: "Ongoing Disaster", icon: <MdFlood />, href: "/ongoing-disaster" },
    { label: "Past Disaster", icon: <MdOutlineFlood />, href: "/past-disaster" },
  ];
  
  const lowerPart = [
    { label: "Inbox", icon: <MdOutlineForwardToInbox />, href: "/inbox" },
    { label: "Profile", icon: <CgProfile />, href: "/profile" },
    { label: "Settings", icon: <MdOutlineSettings />, href: "/settings" },
    { label: "Log Out", icon: <MdOutlineLogout />, href: "/log-out" },
  ];

  return (
    <div className="h-100%">
      <div className="relative flex h-full w-full flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
        <nav className="flex min-w-[240px] flex-col gap-1 p-1 font-sans text-base font-normal text-blue-gray-700">
          <div className="relative block w-full">
            <div className="relative mb-4 flex items-center outline-none">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 text-gray-500 top-0 mt-3 mr-4">
                <MdSearch />
              </span>
            </div>
            <hr className="my-2 border-blue-gray-50" />
            {upperPart.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start ${
                  activeButton === item.label ? "bg-yellow-500 text-white" : " hover:bg-blue-500 hover:text-white "
                }`}
                onClick={() => {
                  setActiveButton(item.label);
                  window.location.href = item.href;
                }}
              >
                <div className="grid mr-2 place-items-center">
                  <span>{item.icon}</span>
                </div>
                <p className="block font-sans text-base antialiased font-normal leading-relaxed">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
          <hr className="my-2 border-blue-gray-50" />
          {lowerPart.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start ${
                activeButton === item.label ? "bg-yellow-500 text-white" : "hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => {
                setActiveButton(item.label);
                window.location.href = item.href;
              }}
            >
              <div className="grid mr-4 place-items-center">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
