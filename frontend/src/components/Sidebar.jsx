import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import assets from "../assets/assets.js";

const Sidebar = () => {
  const { logout, onlineUsers } = useContext(AuthContext);

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const [input, setInput] = useState(false);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header Section */}
      <div className="pb-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          {/* <img src={assets.logo} alt="logo" className="max-w-40" /> */}
          <p className="text-2xl">Nexus</p>

          {/* Menu Icon with Dropdown */}
          <div className="relative group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="py-1 max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                className="cursor-pointer text-sm"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
        <img src={assets.search_icon} alt="search" className="w-3" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          placeholder="Search user..."
        />
      </div>

      {/* User List */}
      <div className="mt-5 flex flex-col gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm hover:bg-[#ffffff15] ${
              selectedUser?.id === user._id && "bg-[#282142]/10"
            }`}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
          >
            <img
              src={user.profilePic || assets.avatar_icon}
              alt="avatar"
              className="aspect-square rounded-full w-[35px] object-cover"
            />
            <div className="flex flex-col leading-5 text-sm">
              <p className="font-semibold">{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {unseenMessages?.[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
