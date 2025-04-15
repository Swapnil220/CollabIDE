import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/projectService';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'javascript',
    initialCode: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, description, language, initialCode } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const project = await createProject(formData);
      navigate(`/projects/${project._id}`);
      toast.success('Project created successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="language" className="block text-gray-700 mb-2">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="initialCode" className="block text-gray-700 mb-2">
            Initial Code
          </label>
          <textarea
            id="initialCode"
            name="initialCode"
            value={initialCode}
            onChange={handleChange}
            rows="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mr-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;