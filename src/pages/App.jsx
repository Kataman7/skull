import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from '../routes/routes';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Mon Application</h1>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;