import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AppNavbar = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const pendingCount = tasks.filter((t) => t.status !== 'done').length;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Multi Tools
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/feature">
              Lịch
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tasks">
              Nhiệm vụ{' '}
              {pendingCount > 0 && (
                <Badge bg="warning" text="dark">
                  {pendingCount}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              Giới thiệu
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;