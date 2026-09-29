import { FaBolt } from "react-icons/fa";

import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="logo">
                CodePulse <span className="logo-ai">AI</span>
            </h1>
            <div className="nav-items">
                <div className="backend-status">
                    <span className="status-dot"></span>
                    <span>Backend Connected</span>
                </div>
                <div className="nav-features">
                    <FaBolt className="bolt-icon"/>
                    <div>
                        <h4>Auto Routing</h4>
                        <small>Multi-Model</small>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;