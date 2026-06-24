import {
  LayoutDashboard,
  FolderGit2,
  History,
  Sparkles,
  Settings,
  LogOut,
  User
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "./Sidebar.css";

function Sidebar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    {
      title:"Dashboard",
      icon:<LayoutDashboard size={18}/>,
      path:"/dashboard"
    },
    {
      title:"Generate",
      icon:<Sparkles size={18}/>,
      path:"/generate"
    },
    {
      title:"Projects",
      icon:<FolderGit2 size={18}/>,
      path:"/projects"
    },
    {
      title:"Executions",
      icon:<History size={18}/>,
      path:"/executions"
    },
    {
      title:"Settings",
      icon:<Settings size={18}/>,
      path:"/settings"
    }
  ];

  return (

    <aside className="sidebar">

      <div className="logo">

        <div className="logo-circle"/>

        <div>

          <h2>NeuroForge</h2>

          <p>AI Software Engineer</p>

        </div>

      </div>

      <nav>

        {
          menu.map(item => (

            <NavLink
              key={item.path}
              to={item.path}
              className="nav-item"
            >
              {item.icon}
              <span>{item.title}</span>
            </NavLink>

          ))
        }

      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <User size={18} />
          <span>{user?.username || "User"}</span>
        </div>
        <button 
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;