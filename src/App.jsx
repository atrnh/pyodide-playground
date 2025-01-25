import PythonPlayground from "./components/PythonPlayground";

function App() {
  return (
    <>
      <PythonPlayground initialCode="print('Hello, world!')" />
      <h2>Another one</h2>
      <PythonPlayground initialCode="n = sum([1, 2, 3])" />
    </>
  );
}

export default App;
