import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoApp from '../assets/img/logo192.png';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import {useState, useEffect } from 'react';

const Header = (props) => {
    // const {hideHeader, setHideHeader} = useState(false);
    // useEffect(() => {
    //     if(window.location.pathname === '/login') {
    //         setHideHeader(true);
    //     }
    // },[])

    const { logout, user  } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogOut = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully!");
    }
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img 
                            src={logoApp}
                            width="30px"
                            height="30px"
                            className='d-inline-block align-top mr-3'
                            alt='img'
                        />
                        Minh Tung Learn React
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {(user && user.auth || window.location.pathname === '/') && 
                            <>
                                <Nav className="me-auto">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                    <NavLink to="/user" className="nav-link">Manage Users</NavLink>
                                </Nav>
                                <Nav>
                                    {user && user.email && <span className='nav-link'>Welcome {user.email}</span>}
                                    <NavDropdown title="Setting" id="basic-nav-dropdown">
                                        {user && user.auth === false 
                                        ? <NavLink to="/login" className="dropdown-item">Login</NavLink>
                                        :<NavDropdown.Item onClick={() => handleLogOut()}> Logout</NavDropdown.Item> 
                                        } 
                                    </NavDropdown>
                                </Nav>
                            </>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
