import Home from "./components/Home";
import ResultsPage from "./components/ResultsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageOverview from "./components/PageOverview";
import User from "./components/User";
export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <User />
      <div className="App">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results/:term" element={<ResultsPage />} />
            <Route
              path="search/:term/page/:pageID"
              element={<PageOverview />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
