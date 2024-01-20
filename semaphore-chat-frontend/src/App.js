import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import ChatBoard from './pages/ChatBoard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <Header className='flex-none' />
        <Routes className='flex-grow overflow-auto'>
          <Route path='/' element={<Login />} />
          <Route path='/chat' element={<ChatBoard />} />
        </Routes>
        <Footer className='flex-none' />
      </div>
    </Router>
  );
}

export default App;
