import { useState } from "react";
import search from "../../../assets/icons/search.png";
import setting from "../../../assets/icons/setting.png";

const Sidebar = () => {
  const [active, setActive] = useState("Home");
  
  const menuItems = [
    { name: "Home", icon: setting },
    { name: "Disaster Control", icon: setting },
    { name: "Analytics", icon: setting },
    { name: "Resources", icon: setting, badge: "14 Events" },
    { name: "Communication", icon: setting },
    { name: "Emergency", icon: setting },
  ];

  return (
    <div className="w-70 h-screen bg-white shadow-lg p-4 flex flex-col my-5">
      <div className="relative mt-4 mb-4">
        <img className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" src={search} />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-2 py-2 bg-gray-100 rounded-md focus:outline-none"
        />
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-left transition ${
              active === item.name ? "bg-amber-300 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              <img src={item.icon} alt="setting icon" className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {/* {item.badge && <Badge className="bg-blue-500 text-white text-xs">{item.badge}</Badge>} */}
          </button>
        ))}
      </nav>
      <div className="border-t pt-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
          <span>Support</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
