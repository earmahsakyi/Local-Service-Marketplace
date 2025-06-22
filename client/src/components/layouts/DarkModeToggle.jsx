import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const getInitialMode = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    console.log("theme in localStorage:", saved);
    if (saved) return saved;
    // Remove the OS preference check:
    // if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
  return "light";
};

  const [theme, setTheme] = useState(getInitialMode);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <button
      className={`ml-4 px-3 py-2 rounded-md border transition
        ${theme === "dark"
          ? "bg-gray-800 text-yellow-300 border-gray-700 hover:bg-gray-700"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default DarkModeToggle;