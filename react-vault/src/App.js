import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { PersonalOverview } from './personal-overview/personalOverview';
import { ApplyMaintenance } from './apply-maintenance/applyMaintenance';

function App() {
  return (
      <div>
        <Header></Header>
          <Router>
            <Route path="/admin" component={PersonalOverview}/>
            <Route path="/maintenance" component={ApplyMaintenance}/>
          </Router>
        <Footer></Footer>
      </div>
  );
}

export default App;
