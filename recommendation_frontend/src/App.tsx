import Home from "./components/Home";
import Results from "./components/Results";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results/:term" element={<Results />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
