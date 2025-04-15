import axios from 'axios';

const API_URL = '/api/projects';

// Get all projects for current user
export const getProjects = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data.projects;
};

// Get single project
export const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data.project;
};

// Create new project
export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data.project;
};

// Execute code
export const executeCode = async (projectId, { code, language }) => {
  const response = await axios.post(
    `${API_URL}/${projectId}/execute`,
    { code, language },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.data.output;
};