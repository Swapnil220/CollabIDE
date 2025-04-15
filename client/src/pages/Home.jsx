import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Collaborate on Code in Real-Time
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        A platform for developers to write, run, and share code together with
        real-time collaboration features.
      </p>
      {user ? (
        <Link
          to="/dashboard"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;