import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DesignPage from './pages/DesignPage';
import OtherPage from './pages/OtherPage';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <Link to="/">Design</Link>
                        <Link to="/other">Other</Link>
                    </nav>
                    <Routes>
                        <Route path="/" element={<DesignPage />} />
                        <Route path="/other" element={<OtherPage />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
