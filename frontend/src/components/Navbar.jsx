import {
  Bell,
  Search
} from "lucide-react";

import "./Navbar.css";

function Navbar() {

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (

    <header className="navbar">

      <div className="navbar-left">

        <h2 className="welcome">

          {greeting} 👋

        </h2>

        <p className="subtitle">

          Welcome to NeuroForge AI Operating System

        </p>

      </div>

      <div className="navbar-right">

        <div className="search-box">

          <Search size={18}/>

          <input

            type="text"

            placeholder="Search projects..."

          />

        </div>

        <button className="icon-btn">

          <Bell size={18}/>

          <span className="notification-dot"></span>

        </button>

      </div>

    </header>

  );

}

export default Navbar;