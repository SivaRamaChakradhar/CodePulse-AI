import { NavLink } from "react-router-dom";

import { SiGoogleanalytics } from "react-icons/si";
import { MdHistory } from "react-icons/md";
import { RiAiGenerate3dFill } from "react-icons/ri";
import { SiEslint } from "react-icons/si";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiGooglegemini } from "react-icons/si";

import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                    <NavLink to="/generate" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        <RiAiGenerate3dFill size={20} />
                        Generate
                    </NavLink>
                    <NavLink to="/analyze" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        <SiGoogleanalytics size={20} />
                        Analyze
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        <MdHistory size={20} />
                        History
                    </NavLink>
            </nav>
            <div className="sidebar-footer">
                <h1 className="sidebar-footer-text">CodePlus AI</h1>
                <p className="sidebar-footer-para">Multi-Modal AI Assistant</p>
                <h4 className="sidebar-footer-heading">Powered by</h4>
                <ul className="sidebar-footer-links">
                    <li>
                        <AiTwotoneThunderbolt size={20} color="#eb720f" /> Groq(Llama 3.3)
                    </li>
                    <li>
                        <SiGooglegemini size={20} color="#0e68e7" /> Gemini 1.5
                    </li>
                    <li>
                        <SiEslint size={20} color="#0feb60" /> EsLint
                    </li>
                    <li>
                        <BiLogoPostgresql size={20} color="#0e68e7" /> PostgreSQL
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;