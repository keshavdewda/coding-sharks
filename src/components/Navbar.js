import { Navbar, Nav, Container } from 'react-bootstrap';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../Images/logo.png';
import SearchBar from './SearchBar';
import data from "../data/data.json";
import { flattenTopics } from "../utils/topicSearch";
import "./Navbar.css";

const NavbarComponent = () => {
    const topics = useMemo(() => flattenTopics(data?.cards || []), []);

    return (
        <Navbar bg="white" expand="lg" sticky="top" className="navbar-custom">
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
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
                        <Nav.Link as={Link} to="/" className="nav-link">
                            Curriculum
                        </Nav.Link>
                        <Nav.Link as={Link} to="/topic/introduction-to-js-programming" className="nav-link">
                            Learning Hub
                        </Nav.Link>
                        <Nav.Link as={Link} to="/jscompiler" className="nav-link">
                            JS Compiler
                        </Nav.Link>
                        <Nav.Link as={Link} to="/Ai" className="nav-link">
                            AI Mentor
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
