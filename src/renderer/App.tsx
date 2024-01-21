import { useEffect, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Background from './Background';
import UI from './UI';
import { AppContext, Parameters, initialContext } from './context/AppContext';
import './styles/index.scss';

function Root() {
  return (
    <div className="wrapper">
      <Background />
      <UI />
    </div>
  );
}

export default function App({ parameters }: { parameters: Parameters }) {
  const [mode, setMode] = useState(initialContext.mode);
  const [currentPlayingMode, setCurrentPlayingMode] = useState(
    initialContext.currentPlayingMode
  );
  const [wsConnection, setWsConnection] = useState<null | WebSocket>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const connection = new WebSocket('ws://localhost:8080');
    const open = () => {};
    const message = (event: any) => {
      try {
        const parsedData = JSON.parse(event?.data);
        const parsedMessage = JSON.parse(parsedData.message);
        parsedMessage?.mode && setMode('null');
        setTimeout(() => {
          parsedMessage?.currentPlayingMode &&
            setCurrentPlayingMode(parsedMessage?.currentPlayingMode);
          parsedMessage?.mode && setMode(parsedMessage?.mode);
        }, 1);
      } catch (error) {}
      console.log('Message from server ', event.data);
    };
    connection.addEventListener('open', open);
    connection.addEventListener('message', message);
    setWsConnection(connection);
    return () => {
      if (connection && connection?.OPEN) {
        connection.removeEventListener('open', open);
        connection.removeEventListener('message', message);
        connection.close();
      }
      setWsConnection(null);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        parameters,
        wsConnection,
        mode,
        currentPlayingMode,
        setCurrentPlayingMode,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
