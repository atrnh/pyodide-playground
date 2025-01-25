import { loadPyodide } from "pyodide";

class SynthConsole {
  constructor(worker) {
    this.buffer = [];
    this.decoder = new TextDecoder();
    this.worker = worker;
  }
  write(buffer) {
    this.buffer.push(this.decoder.decode(buffer));
    return buffer.length;
  }
  flush() {
    this.worker.postMessage({ stdout: this.buffer.join("") });
    this.buffer = [];
  }
}

async function initPyodide() {
  self.pyodide = await loadPyodide();
  self.synthConsole = new SynthConsole(self);
  self.pyodide.setStdout(self.synthConsole);
}
let pyodideReadyPromise = initPyodide();

self.addEventListener("message", async ({ data }) => {
  await pyodideReadyPromise;
  console.log("worker received message", data);

  try {
    const result = await self.pyodide.runPythonAsync(data);
    console.log("Pyodide result", result);
    self.synthConsole.flush();
  } catch (error) {
    self.postMessage({ error: error.message });
  }
});
