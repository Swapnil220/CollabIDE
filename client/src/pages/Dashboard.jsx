import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  console.log(user,"user in Dashboarddddddddddddd")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Link
          to="/projects/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
          <Link
            to="/projects/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                  {project.language}
                </span>
                <span className="ml-auto">
                  Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;