import Home from "./screens/Home";
import Mock from "./screens/Mock";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route path="/mock" element={<Mock />} />
        </Routes>
      </BrowserRouter>
      {/* <Mock /> */}
    </div>
  )
}

export default App;