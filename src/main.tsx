// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { registerLicense } from '@syncfusion/ej2-base';
// registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhLYVJ1WmFZfVhgdl9HaVZSTWYuP1ZhSXxVdkdjX39ccX1WT2RYWUF9XEA=');
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerLicense } from '@syncfusion/ej2-base';

// Register Syncfusion license
  registerLicense('Ngo9BigBOggjGyl/VkR+XU9Ff1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3hTdERlWX1cdHBVRWdcU091XQ==');

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
