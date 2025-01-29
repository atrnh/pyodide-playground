/* eslint-disable react/prop-types */
import { useRef, useState, useEffect, useMemo } from "react";
import * as Comlink from "comlink";
import PyodideWorker from "../workers/pyworker.js?worker";
import { createEditor } from "../editor";
import { usePyodide } from "../py/context";

const PlaygroundControls = ({ onRun, onReset, onCopy }) => {
  return (
    <div>
      <button onClick={onReset}>Reset</button>
      <button onClick={onCopy}>Copy</button>
      <button onClick={onRun}>Run</button>
    </div>
  );
};

export const CodemirrorContainer = ({ initialCode, editorViewRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!editorViewRef.current && containerRef.current) {
      editorViewRef.current = createEditor({
        doc: initialCode,
        parent: containerRef.current,
      });
    }
  }, [containerRef, editorViewRef, initialCode]);

  return (
    <div className="codemirror-wrapper" ref={containerRef}></div>
  );
};

export const PythonPlayground2 = ({ initialCode }) => {
  const editorViewRef = useRef(null);
  const pyodide = usePyodide();
  const [runResult, setRunResult] = useState([]);
  return (
    <div className="playground">
      <PlaygroundControls
        onRun={async () => {
          const input = editorViewRef?.current?.state?.doc?.toString();
          const result = await pyodide.runPythonAsync(
            input,
            Comlink.proxy((error, result) => {
              if (error) {
                console.error(error);
                return;
              }
              console.log("result", result);
              setRunResult([result]);
            }),
          );
          setRunResult([result]);
        }}
        onReset={() => {
          editorViewRef?.current.dispatch({
            changes: {
              from: 0,
              to: editorViewRef?.current.state.doc.toString().length,
              insert: initialCode,
            },
          });
          setRunResult([]);
        }}
      />
      <CodemirrorContainer
        initialCode={initialCode}
        editorViewRef={editorViewRef}
      />
      <div className="output">
        <pre>
          <code>{runResult.join("\n")}</code>
        </pre>
      </div>
    </div>
  );
};

export const PythonPlayground = ({ initialCode }) => {
  const editorViewRef = useRef(null);
  const [runResult, setRunResult] = useState([]);
  const pyodide = useMemo(() => new PyodideWorker(), []);

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
      <CodemirrorContainer
        initialCode={initialCode}
        editorViewRef={editorViewRef}
      />
      <div className="output">
        <pre>
          <code>{runResult.join("\n")}</code>
        </pre>
      </div>
    </div>
  );
};

export default PythonPlayground;
