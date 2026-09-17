import { BrowserRouter, Routes, Route } from "react-router-dom";
import RainfallPrediction from "./pages/RainfallPrediction";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<RainfallPrediction />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;