import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import LoginRoute from "./LoginRoute.tsx";
import {useState} from "react";
import GuideModal from "./components/GuideModal.tsx";
import {PixelPositionProvider} from "./hooks/PixelPositionContext.tsx";
import MobileHome from "./MobileHome.tsx";
import MobileGuideModal from "./components/MobileGuideModal.tsx";
import {ScaleProvider} from "./hooks/ScaleContext.tsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(
        localStorage.getItem("guide_seen") !== "true"
    );
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    console.log(isAuthenticated);

    return (
        <PixelPositionProvider>
        <ScaleProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ?
                                isMobile ?
                                    <div>
                                        <MobileGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                                        <MobileHome />
                                    </div> :
                                    <div>
                                        <GuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                                        <Home />
                                    </div>
                                : <LoginRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ScaleProvider>
        </PixelPositionProvider>
    );
}

export default App;