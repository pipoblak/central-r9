import React from 'react';

export type Parameters = {
  id: string;
  resources_path: string;
};

export const initialContext = {
  parameters: {} as Parameters,
  wsConnection: null as null | WebSocket,
  mode: 'cycle',
  currentPlayingMode: 'fenomeno',
  setCurrentPlayingMode: (...args: any) => {},
};

export const AppContext = React.createContext(initialContext);
