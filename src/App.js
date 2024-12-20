import Container from 'react-bootstrap/esm/Container';
import './App.scss';
import Header from './components/Header';
import TableUsers from './components/TableUsers';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import { useContext } from 'react';
import { UserContext } from './Context/UserContext';

function App() {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <>
      <div className='app-container'>
          <Container>
            <Header />
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/user" element={<TableUsers />}/>
              <Route path="/login" element={<Login />}/>
            </Routes>
            
          </Container> 
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme = "light"
        />
    </>
  );
}

export default App;
