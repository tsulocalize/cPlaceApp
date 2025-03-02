import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import LoginRoute from "./LoginRoute.tsx";
import {useState} from "react";
import GuideModal from "./components/GuideModal.tsx";
import {PixelPositionProvider} from "./hooks/PixelPositionContext.tsx";
import MobileHome from "./MobileHome.tsx";
import MobileGuideModal from "./components/MobileGuideModal.tsx";
import {ScaleProvider} from "./hooks/ScaleContext.tsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(
        localStorage.getItem("guide_seen") !== "true"
    );

    return (
        <PixelPositionProvider>
        <ScaleProvider>
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
        </ScaleProvider>
        </PixelPositionProvider>
    );
}

export default App;