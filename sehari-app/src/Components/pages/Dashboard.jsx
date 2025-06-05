// import { useState, useEffect, useRef } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import amazing from "../images/Space.jpg";
// // import library from "../images/homebg.jpg"
// import React from 'react';
// function useClickOutside(ref, callback) {
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (ref.current && !ref.current.contains(event.target)) {
//         callback();
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [callback, ref]);
// }

// function Dash() {
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [newTaskTime, setNewTaskTime] = useState("08:00");
//   const [newTaskCategory, setNewTaskCategory] = useState("Session");
//   const [activeSection, setActiveSection] = useState("General Tasks");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTaskId, setActiveTaskId] = useState(null);
// //   const [showColorPicker, setShowColorPicker] = useState(false);
//   const menuRef = useRef(null);
//   const [wallpapers] = useState([
//     {
//       id: 1,
//       name: "Default",
//       class: "bg-[#191919]",
//       thumbnailClass: "bg-[#191919]",
//     },
//     {
//       id: 2,
//       name: "Space",
//       image: amazing,
//       thumbnailClass: "bg-gray-800",
//       darkText: true, // Flag for dark backgrounds
//     },
//   ]);

//   const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);
//   const isImageBackground = !!selectedWallpaper.image;
// //   const isDarkBackground = selectedWallpaper.darkText || false;

//   const sections = ["General Tasks", "My Schedule", "Work", "Important"];
//   const categories = [
    
//     "Work",
//     "Personal",
//     "Me Time",
//     "Project",
//   ];
//   const statuses = ["Upcoming", "Ongoing", "Complete"];
//   const [colorOptions] = useState([
//     "bg-[#32576d]",
//     "bg-[#2d6348]",
//     "bg-[#95713a]",
//     "bg-[#7f4140]",
//     "bg-[#593f73]",
//     "bg-[#3f4a73]",
//   ]);

//   useClickOutside(menuRef, () => {
//     setActiveTaskId(null);
//   });

//   // ⬇ Fetch tasks from backend saat load
//   useEffect(() => {
//     fetch("http://localhost:5000/api/tasks")
//       .then((res) => res.json())
//       .then((data) => setTasks(data))
//       .catch((err) => console.error("Error fetching tasks:", err));
//   }, []);

//   // const addTask = () => {
//   //   if (newTask.trim()) {
//   //     const randomColor =
//   //       colorOptions[Math.floor(Math.random() * colorOptions.length)];
//   //     const task = {
//   //       id: Date.now().toString(),
//   //       text: newTask,
//   //       time: newTaskTime,
//   //       category: newTaskCategory,
//   //       status: "Upcoming",
//   //       section: activeSection,
//   //       color: randomColor,
//   //       createdAt: new Date(),
//   //     };
//   //     setTasks([...tasks, task]);
//   //     setNewTask("");
//   //   }
//   // };
//       const addTask = () => {
//         if (newTask.trim()) {
//           const randomColor =
//             colorOptions[Math.floor(Math.random() * colorOptions.length)];
//           const task = {
//             text: newTask,
//             time: newTaskTime,
//             category: newTaskCategory,
//             status: "Upcoming",
//             section: activeSection,
//             color: randomColor,
//           };

//           fetch("http://localhost:5000/api/tasks", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(task),
//           })
//             .then((res) => res.json())
//             .then((data) => {
//               setTasks((prev) => [...prev, { ...task, id: data.id }]);
//               setNewTask("");
//             })
//             .catch((err) => console.error("Error saving task:", err));
//         }
//       };

//   const updateTaskStatus = (id, newStatus) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//   };
//   const updateTaskColor = (id, newColor) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, color: newColor } : task
//       )
//     );
//   };

//   const removeTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     // Dropped outside the list
//     if (!destination) return;

//     // Same position
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     // Moving within the same column (reordering)
//     if (source.droppableId === destination.droppableId) {
//       const status = source.droppableId;
//       const newTasks = [...tasks];
//       const filteredTasks = newTasks.filter((task) => task.status === status);

//       const [removed] = filteredTasks.splice(source.index, 1);
//       filteredTasks.splice(destination.index, 0, removed);

//       const updatedTasks = newTasks.map((task) =>
//         task.status === status ? filteredTasks.shift() : task
//       );

//       setTasks(updatedTasks);
//     } else {
//       // Moving to a different column (changing status)
//       const sourceStatus = source.droppableId;
//       const destStatus = destination.droppableId;

//       const newTasks = [...tasks];
//       const sourceTasks = newTasks.filter(
//         (task) => task.status === sourceStatus
//       );
//       const destTasks = newTasks.filter((task) => task.status === destStatus);

//       const [movedTask] = sourceTasks.splice(source.index, 1);
//       movedTask.status = destStatus;
//       destTasks.splice(destination.index, 0, movedTask);

//       const updatedTasks = newTasks.map((task) => {
//         if (task.status === sourceStatus) return sourceTasks.shift();
//         if (task.status === destStatus) return destTasks.shift();
//         return task;
//       });

//       setTasks(updatedTasks);
//     }
//   };

//   const filteredTasks = tasks.filter((task) => {
//     const matchesSection =
//       activeSection === "General Tasks" || task.section === activeSection;
//     const matchesSearch = task.text
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesSection && matchesSearch;
//   });

//   const tasksByStatus = (status) => {
//     return filteredTasks
//       .filter((task) => task.status === status)
//       .sort((a, b) => {
//         const timeToMinutes = (time) => {
//           const [hours, minutes] = time.split(":").map(Number);
//           return hours * 60 + minutes;
//         };
//         return timeToMinutes(a.time) - timeToMinutes(b.time);
//       });
//   };

//   return (
//     <div className={`max-h-screen`}>
//       {/* Header */}
//       <header className="bg-[#202020] text-white p-4 shadow-lg h-[56px]">
//         <h1 className="text-xl font-bold">
//           Upcoming Today Task:{" "}
//           {tasksByStatus("Upcoming")[0]?.text || "No upcoming tasks"}
//         </h1>
//       </header>

//       <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">
//         {/* Sidebar */}

//         <div className="w-100 bg-[#202020] p-4 flex flex-col gap-4 shadow-md z-10">
//           <div className="mt-1">
//             {" "}
//             {/* Puts it at the bottom */}
//             <h3 className="text-xl font-medium text-white mb-2">
//               Wallpaper
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {wallpapers.map((wallpaper) => (
//                 <button
//                   key={wallpaper.id}
//                   onClick={() => setSelectedWallpaper(wallpaper)}
//                   className={`w-45 h-10 rounded-md border-2 overflow-hidden ${
//                     selectedWallpaper.id === wallpaper.id
//                       ? "border-white ring-2 ring-slate-200"
//                       : "border-transparent hover:border-gray-300"
//                   }`}
//                   title={wallpaper.name}
//                 >
//                   {wallpaper.image ? (
//                     <img
//                       src={wallpaper.image}
//                       alt={wallpaper.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div
//                       className={`w-full h-full ${wallpaper.thumbnailClass}`}
//                     />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//           {/* Add Task Form */}
//           <div className="space-y-2 border-t mt-9 border-slate-200">
//             <input
//               type="text"
//               value={newTask}
//               onChange={(e) => setNewTask(e.target.value)}
//               placeholder="Add new task ..."
//               className="w-full border-b  p-2 text-2xl mb-5 border-slate-200 bg-[#202020] bg-opacity-90 text-white  hover:text-white transition"
//             />
//             <div className="flex gap-5">
//               <input
//                 type="time"
//                 value={newTaskTime}
//                 onChange={(e) => setNewTaskTime(e.target.value)}
//                 className="p-2  flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 focus:outline-none text-white  hover:text-white transition"
//               />
//               <select
//                 value={newTaskCategory}
//                 onChange={(e) => setNewTaskCategory(e.target.value)}
//                 className="p-2  flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 focus:outline-none text-white  hover:text-white transition"
//               >
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button
//               onClick={addTask}
//               className="w-full bg-[#000000] hover:bg-slate-200 hover:text-[#202020] transition bg-opacity-85 mb-5 text-2xl text-white p-2 rounded-xl  "
//             >
//               Add Task
//             </button>
//           </div>

//           {/* Search */}
//           <div>
//             <input
//               type="text"
//               placeholder="Find Task"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-2  bg-[#202020] mb-5 focus:outline-none text-xl border-b text-white  hover:text-white transition"
//             />
//           </div>

//           {/* Sections */}
//           <div className="space-y-1 text-white text-xl">
//             {sections.map((section) => (
//               <button
//                 key={section}
//                 className={`w-full text-left p-2 rounded transition ${
//                   activeSection === section
//                     ? "bg-[#383838] "
//                     : "hover:bg-[#383838]"
//                 }`}
//                 onClick={() => setActiveSection(section)}
//               >
//                 {section}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div
//           className="flex-1 p-4 overflow-auto transition-all duration-500"
//            style={
//             isImageBackground
//               ? { 
//                   backgroundImage: `url(${selectedWallpaper.image})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   backgroundAttachment: 'fixed'
//                 }
//               : { background: selectedWallpaper.class }
//           }
//         >
          
//           <DragDropContext onDragEnd={onDragEnd}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {statuses.map((status) => (
//                 <Droppable key={status} droppableId={status}>
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className="bg-[#2f2f2f] text-[#dbe4e0] rounded-lg shadow p-4"
//                     >
//                       <h2 className="font-bold text-lg mb-4 pb-2 border-b">
//                         {status}
//                       </h2>
//                       <div className="space-y-3">
//                         {tasksByStatus(status).map((task, index) => (
//                           <Draggable
//                             key={task.id}
//                             draggableId={task.id}
//                             index={index}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className={`relative border rounded-lg p-3 shadow-sm transition-all duration-200 ease-in-out
//                      ${task.color || "bg-red-500"} 
//                      ${
//                        snapshot.isDragging
//                          ? "transform scale-105 shadow-lg z-10"
//                          : ""
//                      }
//                      ${activeTaskId === task.id ? "ring-2 ring-white" : ""}`}
//                                 onClick={() =>
//                                   setActiveTaskId(
//                                     task.id === activeTaskId ? null : task.id
//                                   )
//                                 }
//                               >
//                                 {/* Task content */}
//                                 <div className="flex justify-between items-start mb-2">
//                                   <h3 className="font-medium text-[#dbe4e0]">{task.text}</h3>
//                                   <span className="text-sm text-[#dbe4e0]">
//                                     {task.time}
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between text-sm text-[#dbe4e0] mb-3">
//                                   <span>{task.category}</span>
//                                   <span>{task.section}</span>
//                                 </div>

//                                 {/* Context menu */}
//                                 {activeTaskId === task.id && (
//                                   <div
//                                     ref={menuRef}
//                                     className="absolute right-0 top-full mt-1 bg-[#3b3b3b] shadow-xl rounded-md p-3 z-20 w-72 "
//                                   >
//                                     <h4 className="text-sm font-semibold text-white mb-3 px-2">
//                                       Task Actions
//                                     </h4>

//                                     <div className="mb-4">
//                                       <p className="text-sm text-white px-2 mb-2">
//                                         Change Color:
//                                       </p>
//                                       <div className="flex flex-wrap gap-3 p-1">
//                                         {colorOptions.map((color) => (
//                                           <button
//                                             key={color}
//                                             onClick={(e) => {
//                                               e.stopPropagation();
//                                               updateTaskColor(task.id, color);
//                                               setActiveTaskId(null);
//                                             }}
//                                             className={`w-8 h-8 rounded-full ${color} cursor-pointer hover:opacity-80 transition-all
//                        ${
//                          task.color === color
//                            ? "ring-2 ring-gray-500 scale-110"
//                            : "ring-1 ring-gray-300"
//                        }`}
//                                             aria-label={`Change to ${color
//                                               .replace("bg-", "")
//                                               .replace("-100", "")}`}
//                                           />
//                                         ))}
//                                       </div>
//                                     </div>

//                                     <div className="border-t pt-3 space-y-2">
//                                       <button
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           updateTaskStatus(task.id, "Complete");
//                                           setActiveTaskId(null);
//                                         }}
//                                         className="w-full text-left text-sm bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2.5 rounded-lg transition flex items-center gap-2"
//                                       >
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           className="h-4 w-4"
//                                           viewBox="0 0 20 20"
//                                           fill="currentColor"
//                                         >
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                         Mark as Complete
//                                       </button>
//                                       <button
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           removeTask(task.id);
//                                         }}
//                                         className="w-full text-left text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2.5 rounded-lg transition flex items-center gap-2"
//                                       >
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           className="h-4 w-4"
//                                           viewBox="0 0 20 20"
//                                           fill="currentColor"
//                                         >
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                         Delete Task
//                                       </button>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     </div>
//                   )}
//                 </Droppable>
//               ))}
//             </div>
//           </DragDropContext>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dash;

import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import amazing from "../images/Space.jpg";
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
      class: "bg-[#191919]",
      thumbnailClass: "bg-[#191919]",
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
      .then((data) => setTasks(data))
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
        color: randomColor,
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const handleUpdateTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === currentEditTask.id ? currentEditTask : task
    );
    setTasks(updatedTasks);
    setEditMode(false);
    setCurrentEditTask(null);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTaskColor = (id, newColor) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, color: newColor } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (source.droppableId === destination.droppableId) {
      const status = source.droppableId;
      const filtered = tasks.filter((t) => t.status === status);
      const rest = tasks.filter((t) => t.status !== status);

      const [removed] = filtered.splice(source.index, 1);
      filtered.splice(destination.index, 0, removed);

      setTasks([...rest, ...filtered]);
    } else {
      const sourceStatus = source.droppableId;
      const destStatus = destination.droppableId;

      const sourceTasks = tasks.filter((t) => t.status === sourceStatus);
      const destTasks = tasks.filter((t) => t.status === destStatus);
      const rest = tasks.filter(
        (t) => t.status !== sourceStatus && t.status !== destStatus
      );

      const [moved] = sourceTasks.splice(source.index, 1);
      moved.status = destStatus;
      destTasks.splice(destination.index, 0, moved);

      setTasks([...rest, ...sourceTasks, ...destTasks]);
    }
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
