import * as Comlink from "comlink";

const synthConsole = {
  buffer: [],
  decoder: new TextDecoder(),
  write(buffer) {
    this.buffer.push(this.decoder.decode(buffer));
    return buffer.length;
  },
  flush() {
    postMessage({ stdout: this.buffer.join("") });
    this.buffer = [];
  },
};

const pyodide = {
  _pyodide: null,
  async init(pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs") {
    const { loadPyodide } = await import(pyodideUrl);
    this._pyodide = await loadPyodide();
    this._pyodide.setStdout(synthConsole);
  },
  async runPythonAsync(code, cb) {
    try {
      const result = await this._pyodide.runPythonAsync(code);
      synthConsole.flush();
      cb(null, result);
    }
    catch (error) {
      cb(error.message);
    }
  },
};

Comlink.expose(pyodide);
