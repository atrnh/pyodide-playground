/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useMemo } from "react";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import PyodideWorker from "../workers/pyworker.js?worker";

const PlaygroundControls = ({ onRun, onReset, onCopy }) => {
  return (
    <div>
      <button onClick={onReset}>Reset</button>
      <button onClick={onCopy}>Copy</button>
      <button onClick={onRun}>Run</button>
    </div>
  );
};

export const PythonPlayground = ({ initialCode }) => {
  const containerRef = useRef(null);
  const editorViewRef = useRef(null);
  const [runResult, setRunResult] = useState([]);
  const pyodide = useMemo(() => new PyodideWorker(), []);

  useEffect(() => {
    // if (editorViewRef.current === null && containerRef !== null) {
    if (!editorViewRef.current && containerRef.current) {
      editorViewRef.current = new EditorView({
        doc: initialCode,
        extensions: [basicSetup, keymap.of([indentWithTab])],
        parent: containerRef.current,
      });
    }
  }, [containerRef, editorViewRef, initialCode]);

  const handleOutput = ({ data }) => {
    console.log("received from worker", data);
    data?.stdout && setRunResult([data.stdout]);
  };

  useEffect(() => {
    if (window.Worker) {
      pyodide.addEventListener("message", handleOutput);

      return () => {
        pyodide.removeEventListener("message", handleOutput);
      };
    }
  });

  const handleResetCode = () => {
    const view = editorViewRef?.current;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.toString().length,
        insert: initialCode,
      },
    });
    setRunResult([]);
  };

  const handleRunCode = async () => {
    // setRunResult([]); // reset the output
    const input = editorViewRef?.current?.state?.doc?.toString();
    console.log("handleRunCode", input);
    pyodide.postMessage(input);
  };

  return (
    <div className="playground">
      <PlaygroundControls onReset={handleResetCode} onRun={handleRunCode} />
      <div className="codemirror-wrapper" ref={containerRef}></div>
      <div className="output">
        <pre>
          <code>{runResult.join("\n")}</code>
        </pre>
      </div>
    </div>
  );
};

export default PythonPlayground;
