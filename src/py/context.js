import { createContext, useContext } from "react";

export const PyodideContext = createContext(null);

export const usePyodide = () => {
  const pyodide = useContext(PyodideContext);
  return pyodide;
};
