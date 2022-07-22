import React from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import './xterm.css';
import c from 'ansi-colors';

import { ISerialConnection } from '@meshtastic/meshtasticjs';
const serialApi = new ISerialConnection();
serialApi.connect({ baudRate: 115200 }).then((data) => {
  console.log(data);
})

const fitAddon = new FitAddon();

let term = new Terminal();
export default class App extends React.Component {
  constructor(props: {}) {
    super(props);

    this.state = {
      logs: ''
    };
  }

  componentDidMount() {
    term = new Terminal({
      convertEol: true,
      fontSize: 18,
      fontFamily: `'Source Code Pro', monospace`,
      rendererType: 'dom' // default is canvas
    });

    const asciiLogo =
      "\n     __ ____               _      _               _    _       \n    / // /\\ \\    ___  ___ | |__  | |_  __ _  ___ | |_ (_)  ___ \n   / // /  \\ \\  / _ \\/ __|| '_ \\ | __|/ _` |/ __|| __|| | / __|\n  / // /    \\ \\|  __/\\__ \\| | | || |_| (_| |\\__ \\| |_ | || (__ \n /_//_/      \\_\\\\___||___/|_| |_| \\__|\\__,_||___/ \\__||_| \\___|\n                                                               \n";

    term.setOption('theme', {
      background: '#111',
      foreground: 'white'
    });

    term.loadAddon(fitAddon);
    term.open(document.getElementById('xterm')!);
    term.write(c.greenBright(asciiLogo));
    term.onKey((key) => {
      const char = key.domEvent.key;
      if (char === 'Enter') {
        this.prompt();
      } else if (char === 'Backspace') {
        term.write('\b \b');
      } else {
        term.write(char);
      }
    });

    fitAddon.fit();

    this.prompt();
  }

  prompt = () => {
    var shellprompt = '$ ';
    term.write('\r\n' + shellprompt);
  };

  render() {
    return <div id='xterm' style={{ height: '100%', width: '100%' }} />;
  }
}
