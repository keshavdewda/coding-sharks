import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home"; 
import JSCompiler from '../pages/jscompiler';
import TopicPage from '../pages/TopicPage';
import Ai from '../pages/Ai';
function AppRouter() {



    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/curriculum" element={<Home />} />
                <Route path="/jscompiler" element={<JSCompiler />} />
                <Route path="/Ai" element={<Ai />} />
                <Route path="/topic/:slug" element={<TopicPage />} />
            </Routes>
        </Router>


    );
}

export default AppRouter;
