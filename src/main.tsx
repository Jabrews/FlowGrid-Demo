import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import ConnectionFactoryContext from './components/Elements/TrackerContext/ConnectionFactoryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionFactoryContext>
          <App />
    </ConnectionFactoryContext>
  </StrictMode>,
)
