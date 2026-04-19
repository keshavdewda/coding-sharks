import { Navbar, Nav, Container } from 'react-bootstrap';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Images/logo.png';
import SearchBar from './SearchBar';
import data from "../data/data.json";
import { flattenTopics } from "../utils/topicSearch";
import "./Navbar.css";

const NavbarComponent = () => {
    const topics = useMemo(() => flattenTopics(data?.cards || []), []);
    const [expanded, setExpanded] = useState(false);

    const handleNavClick = () => {
        setExpanded(false);
    };

    return (
        <Navbar bg="white" expand="lg" sticky="top" className="navbar-custom" expanded={expanded} onToggle={setExpanded}>
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center" onClick={handleNavClick}>
                    <img
                        src={logo}
                        width="180"
                        height="60"
                        className="logo"
                        alt="Company Logo"
                    />
                </Navbar.Brand>

                {/* Toggle Button for Mobile */}
                <Navbar.Toggle aria-controls="navbarSupportedContent" className="border-0 custom-toggler">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>

                {/* Navbar Content */}
                <Navbar.Collapse id="navbarSupportedContent">
                    {/* Search */}
                    <div className="navbar-search-wrapper">
                        <SearchBar topics={topics} />
                    </div>

                    {/* Navigation Links */}
                    <Nav className="ms-auto mb-2 mb-lg-0 nav-links-container">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick}
                        >
                            Curriculum
                        </NavLink>
                        <NavLink
                            to="/topic/introduction-to-js-programming"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick}
                        >
                            Learning Hub
                        </NavLink>
                        <NavLink
                            to="/jscompiler"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick}
                        >
                            JS Compiler
                        </NavLink>
                        <NavLink
                            to="/Ai"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick}
                        >
                            AI Mentor
                        </NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
