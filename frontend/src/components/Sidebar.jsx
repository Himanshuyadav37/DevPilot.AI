import {
  LayoutDashboard,
  FolderGit2,
  History,
  Settings,
  LogOut,
  User,
  Plus
} from "lucide-react";
import {
  MoreHorizontal,
  Trash2
} from "lucide-react";
import {
  NavLink,
  useNavigate
} from "react-router-dom";
import {
  useChat
} from "../contexts/ChatContext";

import {
  useAuth
} from "../contexts/AuthContext";

import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

import "./Sidebar.css";

function Sidebar() {
const [
  activeMenu,
  setActiveMenu
] = useState(null);
  const { user, logout } =
    useAuth();
const {
  loadConversation,
  newChat
} = useChat();
  const navigate =
    useNavigate();

  const [
    conversations,
    setConversations
  ] = useState([]);

  useEffect(() => {

    async function loadChats() {

      try {

        const response =
          await api.get(
            "/conversations"
          );

        setConversations(
          response.data
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

    }

    loadChats();

  }, []);
async function
deleteChat(id) {

  try {

    await api.delete(
      `/conversations/${id}`
    );

    setConversations(
      prev =>
      prev.filter(
        chat =>
        chat._id !== id
      )
    );

  }

  catch(error){

    console.error(
      error
    );

  }

}
  const handleLogout = () => {

    logout();

    navigate(
      "/login"
    );

  };





  const handleNewChat = () => {

  newChat();

  navigate(
    "/generate"
  );

};

  const menu = [

    {
      title: "Dashboard",
      icon:
        <LayoutDashboard
          size={18}
        />,
      path:
        "/dashboard"
    },

    {
      title: "Projects",
      icon:
        <FolderGit2
          size={18}
        />,
      path:
        "/projects"
    },

    {
      title: "Executions",
      icon:
        <History
          size={18}
        />,
      path:
        "/executions"
    },

    {
      title: "Settings",
      icon:
        <Settings
          size={18}
        />,
      path:
        "/settings"
    }

  ];

  return (

    <aside
      className="sidebar"
    >

      <div className="logo">

        <div
          className="logo-circle"
        />

        <div>

          <h2>
            NeuroForge
          </h2>

          <p>
            AI Operating System
          </p>

        </div>

      </div>

      <button
        className="new-chat-btn"
        onClick={
          handleNewChat
        }
      >

        <Plus size={16} />

        <span>
          New Chat
        </span>

      </button>

      <div className="recent-chats">

        <div className="recent-header">

          <h4>
            Chats
          </h4>

        </div>

        {

          conversations
            .slice(0, 20)
            .map(
              chat => (

                <div
  key={chat._id}
  className="chat-item"
  onClick={() => {

    loadConversation(
      chat._id
    );

    navigate(
      "/generate"
    );

  }}
>

  <span>

    💬 {

      chat.title ||

      "Untitled Chat"

    }

  </span>

  <div
    className="chat-actions"
  >

    <button
  className="menu-btn"
  onClick={(e) => {

    e.stopPropagation();

    setActiveMenu(
      activeMenu === chat._id
        ? null
        : chat._id
    );

  }}
>

      <MoreHorizontal
        size={14}
      />

    </button>

    {

      activeMenu ===
      chat._id && (

        <div
          className="chat-menu"
        >

          <button
  onClick={(e) => {

    e.stopPropagation();

    deleteChat(chat._id);

  }}
>

            <Trash2
              size={14}
            />

            Delete

          </button>

        </div>

      )

    }

  </div>

</div>

              )
            )

        }

      </div>

      <div className="sidebar-bottom">

  <div
    className="workspace-section"
  >

    <div
      className="recent-header"
    >

      <h4>
        Workspace
      </h4>

    </div>

    <nav>

      {

        menu.map(
          item => (

            <NavLink
              key={
                item.path
              }
              to={
                item.path
              }
              className="nav-item"
            >

              {
                item.icon
              }

              <span>

                {
                  item.title
                }

              </span>

            </NavLink>

          )
        )

      }

    </nav>

  </div>

  <div
    className="sidebar-footer"
  >

    <div
      className="user-info"
    >

      <User
        size={18}
      />

      <span>

        {
          user?.username ||
          "User"
        }

      </span>

    </div>

    <button
      className="logout-button"
      onClick={
        handleLogout
      }
      title="Logout"
    >

      <LogOut
        size={18}
      />

      <span>
        Logout
      </span>

    </button>

  </div>

</div>
    </aside>

  );

}

export default Sidebar;