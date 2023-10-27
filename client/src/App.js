import './App.css';
import React from 'react';
import Frame from './Frame.js';

function App() {
  // let [contents, setContents] = React.useState("");

  // React.useEffect(() => {
  //   fetch('/express_backend').then(
  //     response => {
  //       if (response.status !== 200)
  //         throw Error();

  //       return response.json()
  //     }
  //   ).then(
  //     body => setContents(body.express)
  //   );
  // }, []);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{contents}</p>
      </header>
      <body>
        <div>{contents}</div>
      </body> */}
      <Frame />
      {/* <p>{contents}</p> */}
    </div>
  );
}

export default App;
