import Calendar from "./components/Calendar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
      <Calendar />
    </div>
  );
}

export default App;
