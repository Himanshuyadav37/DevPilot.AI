import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

function HeroSection(){
  const { user } = useAuth();
  const navigate = useNavigate();

    return(

        <div className="hero">

            <div className="hero-content">

                <h1>
                    Welcome, {user?.username || "User"}.
                </h1>

                <p className="hero-description">
                    Build resilient software systems with intelligent agents. You have 1 active workflow in-progress.
                </p>

                <p className="hero-subtitle">
                    Autonomous Multi-Agent Software Engineer
                </p>

                <button 
                  className="generate-btn"
                  onClick={() => navigate("/generate")}
                >
                    Generate Project
                </button>

            </div>

        </div>

    )
}

export default HeroSection;