import React from 'react';
import ReactDOM from 'react-dom';
import '../../sass/base.scss';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Navbar from "./molecules/Navbar";
import Posts from "./pages/Posts";
import { viewportContext } from '../../contexts/viewport'
import Post from "./pages/Post";

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
        <div className="Home__body">
          <Switch>
            <Route path='/' exact>
              Home
            </Route>
            <Route path="/posts" exact>
              <Posts/>
            </Route>
            <Route path="/posts/:id">
              <Post/>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
    </viewportContext.Provider>
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(<Home/>, document.getElementById('root'));
}
