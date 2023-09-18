import { createRoot } from 'react-dom/client';
import App from './react-src/App'

const container = document.getElementById('root');
const root = createRoot(container!); //eslint-disable-line
root.render(<App />);