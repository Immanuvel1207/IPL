import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">IPL Auction</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user?.role === 'player' && (
              <li className="nav-item">
                <Link className="nav-link" to="/player-dashboard">Dashboard</Link>
              </li>
            )}
            {user?.role === 'buyer' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/buyer-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auction-room">Auction Room</Link>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
          {user ? (
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          ) : (
            <div className="d-flex">
              <Link to="/player-login" className="btn btn-outline-light me-2">Player Login</Link>
              <Link to="/buyer-login" className="btn btn-outline-light me-2">Buyer Login</Link>
              <Link to="/admin-login" className="btn btn-outline-light">Admin Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;