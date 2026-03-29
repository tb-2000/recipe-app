import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WishlistProvider } from './context/WishlistContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <WishlistProvider>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
      </WishlistProvider>
    </BrowserRouter>
  </StrictMode>,
)
