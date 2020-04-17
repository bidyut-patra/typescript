import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { PersonalOverview } from './personal-overview/personalOverview';

function App() {
  return (
      <div>
        <Header></Header>
          <PersonalOverview></PersonalOverview>
        <Footer></Footer>
      </div>
  );
}

export default App;
