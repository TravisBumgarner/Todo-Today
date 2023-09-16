import { createRoot } from 'react-dom/client';

const App = () => {
  return <p>Hi.</p>
}
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);