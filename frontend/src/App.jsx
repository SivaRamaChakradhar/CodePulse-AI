import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Layout from "./components/Layout/Layout";

import Generate from "./pages/Generate/Generate";
import Analyze from "./pages/Analyze/Analyze";
import History from "./pages/History/History";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/generate" replace />} />

                    <Route path="/generate" element={<Generate />} />

                    <Route path="/analyze" element={<Analyze />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;