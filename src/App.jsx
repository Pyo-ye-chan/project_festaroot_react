import React from 'react';
import MainLayout from './components/MainLayout';
import Home from './pages/home/Home';
import './App.css';

function App() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}

export default App;
