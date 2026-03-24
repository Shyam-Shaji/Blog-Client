import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import { ThemeProvider } from './context/theme-provider';
import ProfilePage from './pages/ProfilePage';
import ArticlesPage from './pages/ArticlesPage';


function App() {
  return (
    <>
      <BrowserRouter>
      <ThemeProvider defaultTheme='dark'>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/articles' element={<ArticlesPage/>}/>
      </Routes>
      <Toaster/>
      </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App;
