// src/App.tsx

import React, { useState, useEffect } from "react";
import { Task } from "./models/Task"; // ייבוא המחלקה שלנו
import "./App.css";

// אם יש לך קומפוננטות Header ו-Footer מוגדרות:
import Header from "./components/Header";
import Footer from "./components/Footer";

const STORAGE_KEY = 'myTasksList'; // מפתח לשמירה ב-localStorage

// פונקציה שמנסה לטעון נתונים מ-localStorage (שלב 6)
const loadTasks = (): Task[] => {
    try {
        const jsonTasks = localStorage.getItem(STORAGE_KEY);
        if (jsonTasks === null) {
            return []; // אם אין נתונים, מחזירים מערך ריק
        }
        // המרה מ-JSON לאובייקטי Task (שלב 6)
        return JSON.parse(jsonTasks);
    } catch (e) {
        console.error("Could not load tasks from LocalStorage", e);
        return [];
    }
};


function App() {
  // 3. הגדרת State - אתחול ה-State באמצעות פונקציית הטעינה
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [newTaskName, setNewTaskName] = useState<string>(''); // לניהול קלט המשתמש

  // 10. ו-11. שמירת הנתונים ל-localStorage באמצעות useEffect
  // הפונקציה רצה בכל פעם שמשתנה 'tasks' משתנה
  useEffect(() => {
    console.log("Saving tasks to LocalStorage...");
    // המרה של מערך ה-Task לאובייקט JSON לפני השמירה
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]); // התלות היא במערך ה-tasks


  // 7. ו-8. פונקציה להוספת מטלה
  const addTask = (e: React.FormEvent) => {
    e.preventDefault(); // מונע טעינה מחדש של הדף
    if (!newTaskName.trim()) return; // מונע הוספה של מטלה ריקה

    const newTask = new Task(newTaskName.trim());

    // עדכון המצב בצורה Immutable
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskName(''); // ניקוי שדה הקלט
  };

  // 9. פונקציה למחיקת מטלה
  const deleteTask = (id: string) => {
    // סינון המערך והחזרת כל המטלות שאינן בעלות ה-ID הנבחר
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
  };

  // פונקציה לשינוי סטטוס (עדכון - U)
  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        // אם ה-ID מתאים, משנים את ה-completed לערכו ההפוך
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
          {/* 7. כפתור הוספה (Submit) */}
          <button type="submit">➕ הוסף</button>
        </form>
        
        <hr />

        <h2>רשימת המטלות</h2>
        {/* 5. הצגת טבלת HTML / רשימה */}
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
                        <td colSpan={3}>אין מטלות כרגע. אנא הוסף מטלה חדשה!</td>
                    </tr>
                ) : (
                    tasks.map((task) => (
                        <tr key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)} // קריאה לפונקציית עדכון
                                />
                            </td>
                            <td>{task.name}</td>
                            <td>
                                {/* 9. כפתור מחיקה */}
                                <button onClick={() => deleteTask(task.id)} style={{ color: 'red' }}>
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
