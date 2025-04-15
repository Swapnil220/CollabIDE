import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  console.log(user,"userrrrrrrrrrrrr in nav barrrrrr")

  useEffect(() => {
    // Optional: If user changes, you could also log or perform additional checks here
    console.log(user);  // Debug log to see when user state changes
  }, [user]);

  // Handle logout by clearing localStorage and updating the user state
  const handleLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear the user state
    setUser(null);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          CodeCollab
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600"
              >
                Logout
              </button>
              <span className="text-gray-700">{user.username}</span>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-indigo-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
