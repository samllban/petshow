//import './App.css'
//import RegistrationForm from "../src/components/RegistrationForm";
import Routes from "./routes";
//import { BrowserRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

//import FeaturedProducts from "../src/components/FeaturedProducts";

//import Home from "./pages/Home"

function App() {
  return (
    <BrowserRouter >
      <Routes />
    </BrowserRouter>
  )
}

export default App
