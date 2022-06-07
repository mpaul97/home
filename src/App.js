import Home from "./screens/Home";
import Mock from "./screens/Mock";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route exact path="/mock" element={<Home />} />
          <Route path="/content" element={<Mock />} />
        </Routes>
      </BrowserRouter>
      {/* <Mock /> */}
    </div>
  )
}

export default App;