import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignPage from './pages/DesignPage';
import OtherPage from './pages/OtherPage';
import TopNav from './pages/components/TopNav';
import GalleryPage from "./pages/GalleryPage";




class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <TopNav />
                    <div className="App-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/design" element={<DesignPage />} />
                            <Route path="/gallery" element={<GalleryPage />} />
                            <Route path="/" element={<OtherPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
