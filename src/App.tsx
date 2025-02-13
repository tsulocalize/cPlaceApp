import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";
import {useState} from "react";
import GuideModal from "./components/GuideModal.tsx";
import {PixelPositionProvider} from "./hooks/PixelPositionContext.tsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(
        localStorage.getItem("guide_seen") !== "true"
    );

    return (
        <PixelPositionProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                                <GuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginRoute setIsAuthenticated={setIsAuthenticated}/>} />
                </Routes>
            </BrowserRouter>
        </PixelPositionProvider>
    );
}

export default App;