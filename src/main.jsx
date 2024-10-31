import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Layout from './routes/Layout';
import App from './App.jsx'
import DetailView from './routes/DetailView';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/recipeDetails/:id" element={<DetailView />} />
        </Route>
        <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
                <Link style={{ color: "white" }} to="/">
                  Back to Home
                </Link>
              </main>
            }
          />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)