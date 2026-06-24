import {
  Bell,
  Search
} from "lucide-react";
import "./Navbar.css"
function Navbar() {

  return (

    <div className="navbar">

      <div>

        <h2 className="welcome">
          Welcome Back 👋
        </h2>

        <p className="subtitle">
          Build amazing software with AI
        </p>

      </div>

      <div className="navbar-right">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects..."
          />

        </div>

        <button className="icon-btn">
          <Bell size={18} />
        </button>

       

      </div>

    </div>

  );
}

export default Navbar;