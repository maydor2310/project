// src/App.tsx

import React, { useState, useEffect } from "react";
// Import מתוקן לנתיב assets
import { Task } from "./assets/Task"; 
import "./App.css";

// ⚠️ תיקון: אם קומפוננטות Header ו-Footer אינן קיימות או מכילות שגיאות, 
// אנחנו מגדירים אותן כ-null זמנית כדי למנוע קריסה של המסך הלבן.
const Header = () => null; 
const Footer = () => null;

const STORAGE_KEY = 'myTasksList';

// פונקציה לטעינה מאובטחת של נתונים מ-localStorage
const loadTasks = (): Task[] => {
    try {
        const jsonTasks = localStorage.getItem(STORAGE_KEY);
        if (jsonTasks === null) {
            return [];
        }
        // המרה מ-JSON וטיפול בטייפים
        const parsedTasks = JSON.parse(jsonTasks);
        // ודא שהתוצאה היא מערך, אם לא, תחזיר מערך ריק.
        if (!Array.isArray(parsedTasks)) {
            return [];
        }
        return parsedTasks;
    } catch (e) {
        console.error("Error loading tasks from LocalStorage:", e);
        return [];
    }
};


function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [newTaskName, setNewTaskName] = useState<string>('');

  // שמירת הנתונים ל-localStorage בכל שינוי ב-tasks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]); 


  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask = new Task(newTaskName.trim());
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskName('');
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };


  return (
    <div className="app">
      <Header />

      <main>
        <h2>ניהול משימות (Task Manager)</h2>

        {/* טופס הוספת מטלה */}
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="הכנס שם משימה..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button type="submit" disabled={!newTaskName.trim()}>➕ הוסף</button>
        </form>
        
        <hr />

        <h2>רשימת המטלות</h2>
        {/* הצגת טבלת המטלות */}
        <table>
            <thead>
                <tr>
                    <th>סטטוס</th>
                    <th>שם המטלה</th>
                    <th>פעולות</th>
                </tr>
            </thead>
            <tbody>
                {tasks.length === 0 ? (
                    <tr>
                        <td colSpan={3} style={{ textAlign: 'center', fontStyle: 'italic' }}>אין מטלות כרגע. אנא הוסף מטלה חדשה!</td>
                    </tr>
                ) : (
                    tasks.map((task) => (
                        <tr key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)}
                                />
                            </td>
                            <td>{task.name}</td>
                            <td>
                                <button onClick={() => deleteTask(task.id)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>
                                    ❌ מחק
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
        
      </main>

      <Footer />
    </div>
  );
}

export default App;
