import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AppNavbar.css';

const AppNavbar = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const pendingCount = tasks.filter((t) => t.status !== 'done').length;

  return (
    <Navbar expand="lg" className="mb-4 app-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="app-navbar-brand">
          Multi Tools
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end className="app-nav-link">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/feature" className="app-nav-link">
              Lịch
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tasks" className="app-nav-link">
              Nhiệm vụ{' '}
              {pendingCount > 0 && (
                <Badge bg="warning" text="dark" className="font-mono">
                  {pendingCount}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/lessons" className="app-nav-link">
              Lessons
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="app-nav-link">
              Giới thiệu
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;