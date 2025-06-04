import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle sidebar close
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handleCloseSidebar();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Initial columns data
  const initialColumns = [
    {
      id: 'todo',
      title: 'To do',
      tasks: [
        {
          id: '1',
          title: 'Scope Q1 upcoming work',
          priority: 'Medium',
          category: 'Other',
          assignee: '/avatar1.jpg',
          dueDate: 'Wednesday',
          backgroundColor: '#ffffff',
          completed: false
        },
        {
          id: '2',
          title: '[Typo] Product & features page',
          priority: 'High',
          category: 'Bug',
          assignee: '/avatar2.jpg',
          dueDate: 'Thursday',
          backgroundColor: '#ffffff',
          completed: false
        },
        {
          id: '3',
          title: '[Bug] Clicking on "Learn more" leads to error message',
          priority: 'High',
          category: 'Bug',
          assignee: '/avatar3.jpg',
          dueDate: 'Thursday',
          backgroundColor: '#ffffff',
          completed: false
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In progress',
      tasks: [
        {
          id: '4',
          title: 'Navigation update to top bar',
          priority: 'Low',
          category: 'Web',
          assignee: '/avatar4.jpg',
          dueDate: 'Tomorrow',
          backgroundColor: '#ffffff',
          completed: false
        },
        {
          id: '5',
          title: 'Q4 product performance improvements',
          priority: 'Medium',
          category: 'Other',
          assignee: '/avatar1.jpg',
          dueDate: 'Today',
          backgroundColor: '#ffffff',
          completed: false
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '6',
          title: 'Scope Q4 performance improvements',
          priority: 'High',
          category: 'Other',
          assignee: '/avatar2.jpg',
          dueDate: 'Today',
          backgroundColor: '#ffffff',
          completed: true
        },
        {
          id: '7',
          title: 'Search bar is failing on Safari',
          priority: 'Low',
          category: 'Web',
          assignee: '/avatar3.jpg',
          dueDate: 'Yesterday',
          backgroundColor: '#ffffff',
          completed: true
        },
        {
          id: '8',
          title: '[Bug] Incorrect font size on Careers page',
          priority: 'Medium',
          category: 'Bug',
          assignee: '/avatar4.jpg',
          dueDate: 'Today',
          backgroundColor: '#ffffff',
          completed: true
        }
      ]
    }
  ];

  // State for columns
  const [columns, setColumns] = useState(initialColumns);
  
  // State for drag and drop
  const [activeTask, setActiveTask] = useState(null);
  const [_activeColumn, setActiveColumn] = useState(null);
  
  // State for color picker
  const [showColorPicker, setShowColorPicker] = useState(null);
  
  // Drag and drop refs
  const dragTask = useRef(null);
  const dragColumn = useRef(null);

  // Colors for task backgrounds
  const backgroundColors = [
    '#ffffff', '#f8e9e9', '#e9f8f2', '#e9eef8',
    '#f8f5e9', '#f8e9f3', '#e9f8f8', '#efe9f8'
  ];

  // Handle drag start
  const handleDragStart = (e, task, column) => {
    dragTask.current = task;
    dragColumn.current = column;
    setActiveTask(task);
    setActiveColumn(column);
    
    // Set ghost image effect
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      
      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.style.width = '0';
      dragImage.style.height = '0';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      
      // Remove the element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!dragTask.current || !dragColumn.current) return;

    const updatedColumns = columns.map(column => {
      // Remove from source column
      if (column.id === dragColumn.current?.id) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== dragTask.current?.id)
        };
      }
      // Add to target column
      if (column.id === targetColumn.id) {
        return {
          ...column,
          tasks: [...column.tasks, dragTask.current]
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setActiveTask(null);
    setActiveColumn(null);
    dragTask.current = null;
    dragColumn.current = null;
  };

  // Handle drag end
  const handleDragEnd = () => {
    setActiveTask(null);
    setActiveColumn(null);
    dragTask.current = null;
    dragColumn.current = null;
  };

  // Change task background color
  const changeTaskColor = (columnId, taskId, color) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, backgroundColor: color };
            }
            return task;
          })
        };
      }
      return column;
    });
    setColumns(updatedColumns);
    setShowColorPicker(null);
  };

  // Add new task
  const addTask = (columnId) => {
    const newTask = {
      id: Date.now().toString(),
      title: 'Tugas baru',
      priority: 'Medium',
      category: 'Other',
      assignee: '',
      dueDate: 'Today',
      backgroundColor: '#ffffff',
      completed: columnId === 'done'
    };

    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.color-picker') && !target.closest('.color-button')) {
        setShowColorPicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
            onClick={handleCloseSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button
                  id="sidebarClose"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={handleCloseSidebar}
                >
                  ✕
                </button>
              </div>
              <nav className="space-y-4">
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2">
                  <span className="w-5">📊</span>
                  <span>Dashboard</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2">
                  <span className="w-5">📋</span>
                  <span>Projects</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2">
                  <span className="w-5">👥</span>
                  <span>Team Members</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors py-2">
                  <span className="w-5">⚙️</span>
                  <span>Settings</span>
                </a>
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <a href="#" className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors py-2">
                    <span className="w-5">🚪</span>
                    <span>Logout</span>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <button
          id="sidebarToggle"
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Team Board</h1>
        <div className="flex -space-x-2">
          <img src="https://via.placeholder.com/32/4F46E5/FFFFFF?text=A" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
          <img src="https://via.placeholder.com/32/EF4444/FFFFFF?text=B" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
          <img src="https://via.placeholder.com/32/10B981/FFFFFF?text=C" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
          <img src="https://via.placeholder.com/32/F59E0B/FFFFFF?text=D" alt="Team member" className="w-8 h-8 rounded-full border-2 border-white" />
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="grid grid-cols-3 gap-6 min-w-full">
          {columns.map(column => (
            <div
              key={column.id}
              className="w-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-gray-700">{column.title}</h2>
                <button
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
                  onClick={() => addTask(column.id)}
                >
                  +
                </button>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
                      activeTask?.id === task.id ? 'opacity-50' : 'opacity-100'
                    }`}
                    style={{ backgroundColor: task.backgroundColor }}
                  >
                    <div className="flex items-start mb-2">
                      <div className="mt-1 mr-2">
                        {task.completed ? (
                          <span
                            className="text-green-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedColumns = columns.map(col => {
                                if (col.id === 'done') {
                                  return {
                                    ...col,
                                    tasks: col.tasks.filter(t => t.id !== task.id)
                                  };
                                }
                                if (col.id === 'inprogress') {
                                  return {
                                    ...col,
                                    tasks: [...col.tasks, { ...task, completed: false }]
                                  };
                                }
                                return col;
                              });
                              setColumns(updatedColumns);
                            }}
                          >
                            ✅
                          </span>
                        ) : (
                          <span
                            className="text-gray-400 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedColumns = columns.map(col => {
                                if (col.id === column.id) {
                                  return {
                                    ...col,
                                    tasks: col.tasks.filter(t => t.id !== task.id)
                                  };
                                }
                                if (col.id === 'done') {
                                  return {
                                    ...col,
                                    tasks: [...col.tasks, { ...task, completed: true }]
                                  };
                                }
                                return col;
                              });
                              setColumns(updatedColumns);
                            }}
                          >
                            ⚪
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium mb-2">{task.title}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-600' :
                            task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.category === 'Bug' ? 'bg-purple-100 text-purple-600' :
                            task.category === 'Web' ? 'bg-green-100 text-green-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {task.category}
                          </span>
                          <button
                            className="ml-auto text-xs text-gray-500 hover:text-gray-700 color-button cursor-pointer"
                            onClick={() => setShowColorPicker(task.id)}
                          >
                            🎨
                          </button>
                        </div>
                        {task.assignee && (
                          <div className="flex items-center">
                            <img
                              src={`https://via.placeholder.com/24/6B7280/FFFFFF?text=${task.id.slice(-1)}`}
                              alt="Assignee"
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-xs text-gray-500">{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Color picker */}
                    {showColorPicker === task.id && (
                      <div className="color-picker absolute mt-1 p-2 bg-white rounded-lg shadow-lg z-10 flex flex-wrap gap-2 w-48">
                        {backgroundColors.map((color, index) => (
                          <button
                            key={index}
                            className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => changeTaskColor(column.id, task.id, color)}
                          ></button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => addTask(column.id)}
              >
                <span className="mr-2">+</span>
                Tambah tugas
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;