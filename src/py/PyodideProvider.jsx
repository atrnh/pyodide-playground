import { useEffect, useState } from "react";
import * as Comlink from "comlink";
import { PyodideContext } from "./context";
import PyodideWorker from "./worker.js?worker";

// eslint-disable-next-line react/prop-types
export default function PyodideProvider({ pyodideUrl, children }) {
  const [pyodide, setPyodide] = useState(null);
  // use memo

  useEffect(() => {
    if (pyodide === null) {
      const worker = new PyodideWorker();
      const py = Comlink.wrap(worker);
      setPyodide(py);

      const initPyodide = async () => {
        await py.init(pyodideUrl);
      };
      initPyodide();

      return () => {
        worker.terminate();
      };
    }
  }, [pyodide, pyodideUrl]);

  return (
    <PyodideContext.Provider value={pyodide}>
      {children}
    </PyodideContext.Provider>
  );
}
