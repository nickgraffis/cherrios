import './tailwind.css'
import React, { FC, useContext, useEffect, useState } from 'react'
import { App } from './App'
import ReactDOM from 'react-dom'
import { Groups } from './Groups'
import { Settings } from './Settings'
import netlifyIdentity, { User } from 'netlify-identity-widget';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { logoutUser, loginUser } from './lib/identityActions'
/**
 * Initialize netlify identity widget
 * TODO: Using the GoTrue API from Netlify create custom identity widget
 */
 netlifyIdentity.init();

/**
 * Create context for our authentication
 * useAuth hook avaliable to get current logged in user (null if no user is logged in)
 * useAuthUpdate hook avalliable to change the state of the user.
 * Changing the user state will login or logout the user with netlify identity widget
 */
const AuthContext = React.createContext<{ user: User } | null>(null);
const AuthUpdateContext = React.createContext({});

export function useAuth() {
  return useContext(AuthContext);
};

export function useAuthUpdate() {
  return useContext(AuthUpdateContext);
};

export const Init: FC = () => {
/**
 * State manager to handle user authentication
 */
  const [user, setUser] = useState<{ user: User } | null>(null);

  const [account, setAccount] = useState<{ account: any } | null>(null);

  /**
  * When we start check localhost for currentPoseidonUser
  * If there is a current user set the user state
  * Listen for netlify identity widget login and logout events
  * and change the user state accordingly
  */
  useEffect(() => {
    const localUser: string | null = localStorage.getItem('currentCheerioUser');
    if (localUser) {
      setUser({user: JSON.parse(localUser)});
    }
    netlifyIdentity.on('login', (user) => setUser({ user }));
    netlifyIdentity.on('logout', () => setUser(null));
  }, []);

  /**
  * Listen for changes in the user state and run the login and logout functions
  * to change the local storage of current user
  */

  useEffect(() => {
    if (!user) logoutUser();
    else loginUser();
    if (user) console.log(netlifyIdentity.currentUser()?.token?.access_token);
  }, [user]);
  
  const updateAuth = (user: { user: User } | null) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={user}>
      <AuthUpdateContext.Provider value={updateAuth}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <App />
            </Route>
            <Route path="/groups" exact>
              <Groups />
            </Route>
            <Route path="/settings" exact>
              <Settings />
            </Route>
            <Route path="*">
              <p>Not Found</p>
            </Route>
          </Switch>
        </Router>
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <Init />
  </React.StrictMode>,
  document.getElementById('root')
)
