import { createRoot } from 'react-dom/client';
//@ts-expect-error library without types
import parseLocation from 'parse-location';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
const { query: parameters } = parseLocation(global.location);

root.render(<App parameters={parameters} />);
