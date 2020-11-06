import React from 'react';
import ReactDOM from 'react-dom';
import '../../sass/base.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Navbar from "./molecules/Navbar";
import { viewportContext } from '../../contexts/viewport'

export default function Home() {


  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const [isMobile, setMobileStatus] = React.useState(viewportWidth < 1000);

  window.onresize = () => {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    setMobileStatus(viewportWidth < 1000)
  };


  return (
    <viewportContext.Provider value={isMobile}>
    <div className="Home">
      <BrowserRouter history={createBrowserHistory}>
        <Navbar/>
        <Switch>
          <Route path='/' exact>
            Home
          </Route>
          <Route path="/path1" exact>
            <div className="Home__box">
              First box
            </div>
          </Route>
          <Route path="/path2" exact>
            <div className="Home__box">
              Second box
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
    </viewportContext.Provider>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<Home/>, document.getElementById('root'));
}
