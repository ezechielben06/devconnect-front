import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Point d'entrée de l'app. On charge le CSS avant pour éviter tout FOUC dégueu au premier paint.
createRoot(document.getElementById('root')!).render(<App />);
