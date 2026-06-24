import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "./DashboardLayout.css";

function DashboardLayout({
  children
}) {

  return (

    <div className="layout">

      <Sidebar />

      <div className="main-area">

        <Navbar />

        <main className="content">
          {children}
        </main>

      </div>

    </div>

  );
}

export default DashboardLayout;