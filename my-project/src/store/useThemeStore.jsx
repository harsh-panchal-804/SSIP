import { create } from "zustand";
const useThemeStore= create((set,get)=>({
    theme: localStorage.getItem("theme") || "lemonade",
    setTheme:(theme)=>{
        set({theme:theme})
        localStorage.setItem("theme",theme)
    },
}));
export default useThemeStore;