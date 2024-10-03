import { createSignal, onMount } from 'solid-js';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebContainer } from '@webcontainer/api';
import './App.css';
import '@xterm/xterm/css/xterm.css';
import { xTermTheme } from './theme.ts';

export function App() {
  let terminalRef: HTMLDivElement | undefined;
  const [terminal, setTerminal] = createSignal<Terminal | null>(null);
  const [webcontainerInstance, setWebcontainerInstance] =
    createSignal<WebContainer | null>(null);

  async function startShell(
    terminal: Terminal,
    webcontainerInstance: WebContainer
  ) {
    const shellProcess = await webcontainerInstance.spawn('jsh', {
      env: {},
      terminal: { cols: terminal.cols, rows: terminal.rows },
    });

    shellProcess.output.pipeTo(
      new WritableStream({
        write: (chunk) => terminal.write(chunk),
        close: () => console.info('[stdout][startShell] Terminal closed'),
        start: () => console.info('[stdout][startShell] Terminal started'),
      })
    );

    const input = shellProcess.input.getWriter();
    terminal.onData(async (data) => await input.write(data));

    terminal.onResize(({ cols, rows }) => {
      shellProcess.resize({ cols, rows });
    });

    return shellProcess;
  }

  onMount(async () => {
    if (terminalRef) {
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 18,
        convertEol: true,
        theme: xTermTheme,
        cursorStyle: 'bar',
        windowOptions: {},
        allowProposedApi: true,
        cursorInactiveStyle: 'bar',
        drawBoldTextInBrightColors: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalRef);
      fitAddon.fit();

      setTerminal(term);

      try {
        const wc = await WebContainer.boot();
        setWebcontainerInstance(wc);

        await startShell(term, wc);
      } catch (error) {
        term.writeln(`Failed to initialize WebContainer: ${error}`);
      }
    }
  });

  return (
    <div class="App">
      <h1>WebContainer Shell</h1>
      <sub>available tools: Node.js, npm</sub>
      <div ref={terminalRef} class="terminal-container"></div>
    </div>
  );
}
