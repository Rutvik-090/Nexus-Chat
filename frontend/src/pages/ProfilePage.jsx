import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

function ProfilePage() {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [qrImage, setQrImage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const { data } = await axios.get("/api/qr/generate");
        if (data.success) {
          setQrImage(data.qrImage);
          setUsername(data.username);
        }
      } catch (err) {
        console.error("QR Error:", err.message);
      }
    };
    fetchQR();
  }, []);

  const [selectedImg, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(selectedImg);
    render.onload = async () => {
      const base64Image = render.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-4xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex flex-col md:flex-row rounded-lg p-6 gap-6">
        {/* Left: Profile Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${selectedImg && "rounded-full"}`}
              alt="Avatar"
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            save
          </button>
        </form>

        {/* Right: QR & Username */}
        <div className="flex flex-col items-center justify-center md:w-1/3 gap-4 border-l border-gray-600 pl-6">
          <div className="text-center">
            <h3 className="text-md text-white">Your Username</h3>
            <p className="bg-gray-800 px-4 py-1 rounded-full text-sm mt-1">
              {username || "Loading..."}
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-md text-white">Your QR Code</h3>
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR Code"
                className="w-32 h-32 border border-gray-500 p-1 rounded"
              />
            ) : (
              <p className="text-sm text-gray-400">Loading QR...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
