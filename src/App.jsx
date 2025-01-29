import PythonPlayground, { PythonPlayground2 } from "./components/PythonPlayground";
import PyodideProvider from "./py/PyodideProvider";

function App() {
  return (
    <>
      <h2>Version 2</h2>
      <PyodideProvider pyodideUrl="https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs">
        <PythonPlayground2
          initialCode="print('Hello, world!')"
        />
      </PyodideProvider>
      <h2>Version 1</h2>
      <PythonPlayground initialCode="print('Hello, world!')" />
    </>
  );
}

export default App;
