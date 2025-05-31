import './assets/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GearIcon } from './components/gear/GearIcon'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GearIcon />
  </StrictMode>
)
