import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";
import {useEffect, useState} from "react";
import GuideModal from "./components/GuideModal.tsx";
import {PixelPositionProvider} from "./hooks/PixelPositionContext.tsx";
import MobileHome from "./MobileHome.tsx";
import MobileGuideModal from "./components/MobileGuideModal.tsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(
        localStorage.getItem("guide_seen") !== "true"
    );

    useEffect(() => {
        if (window.location.pathname === "/" && window.matchMedia("(max-width: 768px").matches) {
            window.location.href = "/mobile"
        }
    }, []);

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
                    <Route
                        path="/mobile"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                                <MobileGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                                <MobileHome />
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