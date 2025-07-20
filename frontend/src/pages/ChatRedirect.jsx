import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";

const ChatRedirect = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { users, setSelectedUser } = useContext(ChatContext);

  useEffect(() => {
    const matchedUser = users.find((u) => u.username === username);
    if (matchedUser) {
      setSelectedUser(matchedUser);
      navigate("/"); // Home has ChatContainer
    } else {
      alert("User not found");
      navigate("/");
    }
  }, [username, users]);

  return null;
};

export default ChatRedirect;
