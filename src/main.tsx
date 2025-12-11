import React from "react"; // מייבא את React כדי להשתמש ב-JSX
import ReactDOM from "react-dom/client"; // מייבא את ReactDOM ליצירת root בדפדפן
import App from "./App.tsx"; // מייבא את קומפוננטת השורש App
import "./index.css"; // מייבא את קובץ ה-CSS הראשי של האפליקציה
import { BrowserRouter } from "react-router-dom"; // מייבא את BrowserRouter כדי לאפשר ראוטינג באפליקציה

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement // יוצר root מתוך האלמנט עם id="root" בקובץ index.html
).render(
  <React.StrictMode>
    {/* StrictMode עוזר לזהות בעיות פוטנציאליות בזמן פיתוח */}
    <BrowserRouter>
      {/* BrowserRouter עוטף את האפליקציה ומאפשר שימוש בנתיבים (Routes) */}
      <App /> {/* מציג את קומפוננטת השורש של האפליקציה */}
    </BrowserRouter>
  </React.StrictMode>
);
