import './tailwind.css'
import React, { FC, Suspense, useContext, useEffect, useState } from 'react'
import netlifyIdentity, { User } from 'netlify-identity-widget';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { logoutUser, loginUser } from './lib/identityActions'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Router as RoutingComponent } from './Router';
/**
 * Create context for our authentication
 * useAuth hook avaliable to get current logged in user (null if no user is logged in)
 * useAuthUpdate hook avalliable to change the state of the user.
 * Changing the user state will login or logout the user with netlify identity widget
 */
 export const IdentityContext = React.createContext(null);
const AuthContext = React.createContext<any>(null);
const AuthUpdateContext = React.createContext({});

export function useAuth() {
  return useContext(AuthContext);
};

export function useAuthUpdate() {
  return useContext(AuthUpdateContext);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false
    }
  }
})

export const Init: FC = () => {
/**
 * State manager to handle user authentication
 */
//@ts-ignore
  const [user, setUser] = useState<any>(netlifyIdentity.currentUser()?.jwt());

  /**
  * When we start check localhost for currentPoseidonUser
  * If there is a current user set the user state
  * Listen for netlify identity widget login and logout events
  * and change the user state accordingly
  */
  netlifyIdentity.on('login', (user) => setUser({ user }));
  netlifyIdentity.on('logout', () => setUser(null));

  /**
  * Listen for changes in the user state and run the login and logout functions
  * to change the local storage of current user
  */
  
  const updateAuth = (user: { user: User } | null) => {
    setUser(user);
    console.log(user)
  };

  useEffect(() => {
    netlifyIdentity.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={user}>
        <AuthUpdateContext.Provider value={updateAuth}>
          <Suspense fallback={<p>Loading...</p>}>
            <Router>
              <RoutingComponent />
            </Router>
          </Suspense>
        </AuthUpdateContext.Provider>
      </AuthContext.Provider>
      <ReactQueryDevtools initialIsOpen={true} />
     </QueryClientProvider>
  )
}