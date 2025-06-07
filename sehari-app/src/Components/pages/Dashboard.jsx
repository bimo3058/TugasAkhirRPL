import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import amazing from "../images/Space.jpg";
import relax from "../images/bg2.jpg";
import React from "react";

function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
}

function Dash() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("08:00");
  const [newTaskCategory, setNewTaskCategory] = useState("Session");
  const [activeSection, setActiveSection] = useState("General Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState(null);

  const menuRef = useRef(null);

  const [wallpapers] = useState([
    {
      id: 1,
      name: "Default",
      image: relax,
      thumbnailClass: "bg-[#191919]",
      darkText: true,
    },
    {
      id: 2,
      name: "Space",
      image: amazing,
      thumbnailClass: "bg-gray-800",
      darkText: true,
    },
  ]);

  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);
  const isImageBackground = !!selectedWallpaper.image;

  const sections = ["General Tasks", "My Schedule", "Work", "Important"];
  const categories = ["Work", "Personal", "Me Time", "Project"];
  const statuses = ["Upcoming", "Ongoing", "Complete"];
  const [colorOptions] = useState([
    "bg-[#32576d]",
    "bg-[#2d6348]",
    "bg-[#95713a]",
    "bg-[#7f4140]",
    "bg-[#593f73]",
    "bg-[#3f4a73]",
  ]);

  useClickOutside(menuRef, () => {
    setActiveTaskId(null);
  });

  // ⬇ Fetch tasks from backend saat load
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        const fixedTasks = data.map((task, index) => ({
          ...task,
          id: task.id?.toString() || index.toString(),
        }));
        setTasks(fixedTasks);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const randomColor =
        colorOptions[Math.floor(Math.random() * colorOptions.length)];
      const task = {
        // id: Date.now().toString(),
        // text: newTask,
        // time: newTaskTime,
        // category: newTaskCategory,
        // status: "Upcoming",
        // section: activeSection,
        // color: randomColor,
        // createdAt: new Date(),
        text: newTask,
        time: newTaskTime,
        category: newTaskCategory,
        status: "Upcoming",
        section: activeSection,
        color: randomColor,
      };
      fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
        .then((res) => res.json())
        .then((data) => {
          const taskWithId = { ...task, id: data.id.toString() }; // pastikan string!
          setTasks((prev) => [...prev, taskWithId]);
          setNewTask("");
        });
    }
  };

  const handleUpdateTask = () => {
    if (!currentEditTask || !currentEditTask.id) return;

    fetch(`http://localhost:5000/api/tasks/${currentEditTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentEditTask),
    })
      .then((res) => res.json())
      .then(() => {
        // Update task di state lokal
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === currentEditTask.id ? currentEditTask : task
          )
        );
        setEditMode(false);
        setCurrentEditTask(null);
      })
      .catch((err) => {
        console.error("Gagal update task ke DB:", err);
      });
  };

  const updateTaskStatus = (id, newStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status: newStatus };

    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then(() => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      })
      .catch((err) => {
        console.error("Gagal update status:", err);
      });
  };

  const updateTaskColor = (id, newColor) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, color: newColor } : task
      )
    );
  };

  const removeTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((err) => {
        console.error("Gagal menghapus task:", err);
      });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceList = tasksByStatus(sourceStatus);
    const destList =
      sourceStatus === destStatus ? sourceList : tasksByStatus(destStatus);

    const [movedTask] = sourceList.splice(source.index, 1);
    movedTask.status = destStatus;

    if (sourceStatus === destStatus) {
      destList.splice(destination.index, 0, movedTask);
    } else {
      destList.splice(destination.index, 0, movedTask);
    }

    const newTasks = tasks.map((task) => {
      if (task.id === movedTask.id) {
        return movedTask;
      }
      return task;
    });

    setTasks(newTasks);

    // Simpan ke DB
    fetch(`http://localhost:5000/api/tasks/${movedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movedTask),
    })
      .then((res) => res.json())
      .then(() => {
        console.log("✅ Status updated in DB");
      })
      .catch((err) => {
        console.error("❌ Gagal update status task:", err);
      });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSection =
      activeSection === "General Tasks" || task.section === activeSection;
    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const tasksByStatus = (status) => {
    return filteredTasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const timeToMinutes = (time) => {
          const [h, m] = time.split(":").map(Number);
          return h * 60 + m;
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });
  };

  return (
    <div className="max-h-screen">
      <header className="bg-[#202020] text-white p-4 shadow-lg h-[56px]">
        <h1 className="text-xl font-bold">
          Upcoming Today Task:{" "}
          {tasksByStatus("Upcoming")[0]?.text || "No upcoming tasks"}
        </h1>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">
        <div className="w-100 bg-[#202020] p-4 flex flex-col gap-4 shadow-md z-10">
          <h3 className="text-xl font-medium text-white mb-2">Wallpaper</h3>
          <div className="flex flex-wrap gap-2">
            {wallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setSelectedWallpaper(wp)}
                className={`w-45 h-10 rounded-md border-2 overflow-hidden ${
                  selectedWallpaper.id === wp.id
                    ? "border-white ring-2 ring-slate-200"
                    : "border-transparent hover:border-gray-300"
                }`}
                title={wp.name}
              >
                {wp.image ? (
                  <img
                    src={wp.image}
                    alt={wp.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${wp.thumbnailClass}`} />
                )}
              </button>
            ))}
          </div>

          {/* Form Add / Edit */}
          <div className="space-y-2 border-t mt-9 border-slate-200">
            <input
              type="text"
              value={editMode ? currentEditTask?.text || "" : newTask}
              placeholder="Add new task ..."
              className="w-full border-b p-2 text-2xl mb-5 bg-[#202020] bg-opacity-90 text-white"
              onChange={(e) => {
                if (editMode) {
                  setCurrentEditTask({
                    ...currentEditTask,
                    text: e.target.value,
                  });
                } else {
                  setNewTask(e.target.value);
                }
              }}
            />
            <div className="flex gap-5">
              <input
                type="time"
                value={editMode ? currentEditTask?.time || "" : newTaskTime}
                className="p-2 flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 text-white"
                onChange={(e) => {
                  if (editMode) {
                    setCurrentEditTask({
                      ...currentEditTask,
                      time: e.target.value,
                    });
                  } else {
                    setNewTaskTime(e.target.value);
                  }
                }}
              />
              <select
                value={
                  editMode ? currentEditTask?.category || "" : newTaskCategory
                }
                className="p-2 flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 text-white"
                onChange={(e) => {
                  if (editMode) {
                    setCurrentEditTask({
                      ...currentEditTask,
                      category: e.target.value,
                    });
                  } else {
                    setNewTaskCategory(e.target.value);
                  }
                }}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {editMode ? (
              <>
                <button
                  onClick={handleUpdateTask}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-xl mb-2"
                >
                  Update Task
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setCurrentEditTask(null);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-xl"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={addTask}
                className="w-full bg-[#000000] hover:bg-slate-200 hover:text-black text-white p-2 rounded-xl"
              >
                Add Task
              </button>
            )}
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Find Task"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-[#202020] mb-5 text-xl border-b text-white"
            />
          </div>

          {/* Sections */}
          <div className="space-y-1 text-white text-xl">
            {sections.map((s) => (
              <button
                key={s}
                className={`w-full text-left p-2 rounded ${
                  activeSection === s ? "bg-[#383838]" : "hover:bg-[#383838]"
                }`}
                onClick={() => setActiveSection(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Main Task Content */}
        <div
          className="flex-1 p-4 overflow-auto"
          style={
            isImageBackground
              ? {
                  backgroundImage: `url(${selectedWallpaper.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }
              : { background: selectedWallpaper.class }
          }
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[#2f2f2f] text-[#dbe4e0] rounded-lg shadow p-4"
                    >
                      <h2 className="font-bold text-lg mb-4 pb-2 border-b">
                        {status}
                      </h2>
                      <div className="space-y-3">
                        {tasksByStatus(status).map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative border rounded-lg p-3 ${
                                  task.color || "bg-red-500"
                                } ${
                                  snapshot.isDragging
                                    ? "transform scale-105 shadow-lg"
                                    : ""
                                }`}
                                onClick={() =>
                                  setActiveTaskId(
                                    task.id === activeTaskId ? null : task.id
                                  )
                                }
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium text-[#dbe4e0]">
                                    {task.text}
                                  </h3>
                                  <span className="text-sm">{task.time}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>{task.category}</span>
                                  <span>{task.section}</span>
                                </div>
                                {activeTaskId === task.id && (
                                  <div
                                    ref={menuRef}
                                    className="absolute right-0 top-full mt-1 bg-[#3b3b3b] shadow-xl rounded-md p-3 z-20 w-72"
                                  >
                                    <h4 className="text-white mb-2 font-semibold">
                                      Task Actions
                                    </h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditMode(true);
                                        setCurrentEditTask(task);
                                        setActiveTaskId(null);
                                      }}
                                      className="w-full text-left text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2.5 rounded-lg mb-2"
                                    >
                                      ✏️ Edit Task
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateTaskStatus(task.id, "Complete");
                                        setActiveTaskId(null);
                                      }}
                                      className="w-full text-left text-sm bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2.5 rounded-lg mb-2"
                                    >
                                      ✅ Mark as Complete
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeTask(task.id);
                                      }}
                                      className="w-full text-left text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2.5 rounded-lg"
                                    >
                                      🗑️ Delete Task
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default Dash;
