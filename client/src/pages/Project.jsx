import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useSocket } from '../hooks/useSocket';
import { getProject, executeCode as executeCodeApi } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useRef } from 'react';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const { user } = useAuth();
  const socket = useSocket(id);
  const editorRef = useRef(null);
  const decorationsRef = useRef({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data);
        setCode(data.currentCode || data.initialCode);
      } catch (error) {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!socket || !editorRef.current) return;
  
    socket.emit('join-project', id);
  
    socket.on('code-update', (newCode) => {
      if (newCode !== code) setCode(newCode);
    });
  
    socket.on('code-output', (outputFromOther) => {
      setOutput(outputFromOther);
    });
  
    socket.on('user-cursor', ({ userId, position }) => {
      if (!editorRef.current) return;
  
      const editor = editorRef.current;
      const decoration = {
        range: new window.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        options: {
          className: 'remote-cursor',
          isWholeLine: false,
          glyphMarginClassName: 'remote-cursor-glyph',
          overviewRuler: {
            color: 'rgba(0, 122, 204, 0.5)',
            position: window.monaco.editor.OverviewRulerLane.Right,
          },
        },
      };
  
      if (decorationsRef.current[userId]) {
        decorationsRef.current[userId] = editor.deltaDecorations(decorationsRef.current[userId], [decoration]);
      } else {
        decorationsRef.current[userId] = editor.deltaDecorations([], [decoration]);
      }
    });
  
    return () => {
      socket.off('code-update');
      socket.off('code-output');
      socket.off('user-cursor');
      socket.emit('leave-project', id);
    };
  }, [socket, code]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Send code update to other clients
    if (socket) {
      console.log('[Socket] Sending code-change:', newCode);
      socket.emit('code-change', { projectId: id, code: newCode });
    }
  };

  const executeCode = async () => {
    if (!code.trim()) return;

    setExecuting(true);
    setOutput('Executing...');

    try {
      const result = await executeCodeApi(id, { code, language: project.language });
      console.log(result,"resulttttttttt")

      if (socket) {
        socket.emit('code-output', { projectId: id, output: result });
      }
      
      setOutput(result);
    } catch (error) {
      setOutput(error.response?.data?.error || 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
            {project.language}
          </span>
          {project.owner._id === user.id && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Owner
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-medium">Editor</h3>
              <button
                onClick={executeCode}
                disabled={executing}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {executing ? 'Running...' : 'Run Code'}
              </button>
            </div>
            <div className="h-96">
            <Editor
              height="100%"
              language={project.language}
              theme="vs-light"
              value={code}
              onChange={handleCodeChange}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                editor.onDidChangeCursorPosition(() => {
                  const position = editor.getPosition();
                  if (socket) {
                    socket.emit('cursor-position', {
                      projectId: id,
                      position,
                    });
                  }
                });
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-medium">Output</h3>
            </div>
            <div className="p-4 h-96 overflow-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;