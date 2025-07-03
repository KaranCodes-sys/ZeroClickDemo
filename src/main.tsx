// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// // ✅ Import the SettingsContext provider
// import { SettingsProvider } from './contexts/SettingsContext';

// const rootElement = document.getElementById('root');

// if (rootElement) {
//   const root = createRoot(rootElement);

//   root.render(
//     <React.StrictMode>
//       {/* ✅ Wrap your App with SettingsProvider */}
//       <SettingsProvider>
//         <App />
//       </SettingsProvider>
//     </React.StrictMode>
//   );
// }
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


// ⚙️ Settings context
import { SettingsProvider } from './contexts/SettingsContext';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
        <SettingsProvider>
          <App />
        </SettingsProvider>
    </React.StrictMode>
  );
}
