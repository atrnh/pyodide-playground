import PythonPlayground from "./components/PythonPlayground";

const initialCode = `\
a = 1
b = 2
print(a + b)
# Add more code here!\
`;

function App() {
  return (
    <>
      <h1>Python Playground Demo</h1>
      <p>
        Press the
        {" "}
        <b>Run</b>
        {" "}
        button to execute the Python code below.
      </p>
      <p> You can also add more code using the editor!</p>
      <p>
        Press
        {" "}
        <b>Reset</b>
        {" "}
        to reset the code to its initial state, and
        {" "}
        <b>Copy</b>
        {" "}
        to copy the code to the clipboard.
      </p>
      <PythonPlayground
        initialCode={initialCode}
      />
    </>
  );
}

export default App;
