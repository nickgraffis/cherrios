import React, { FC, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { App } from "./Compose/App";
import { Group } from "./Contacts/Group";
import { Groups } from "./Groups/Groups";
import { useAuth } from "./Init";
import { Login } from "./Login";
import { Settings } from "./Settings/Settings";
import { useState } from "react";
import { Emails } from "./Emails/Emails";
import { GmailOAuth2 } from "./Settings/GmailOAuth2";
import { Layout } from "./Layout";
import { Unsubscribe } from "./Unsubscribe/Unsubscribe";
import { EmailView } from "./Emails/EmailView";
import { NotFound } from "./NotFound";
import { Email } from "./Emails/Email";
import { Help } from "./Help/Help";

export const Router: FC = () => {
  const [redirectRoute, setRedirectRoute] = useState<string>('/')
  const auth = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    setRedirectRoute(location.pathname + location.search)
  }, [])
  return (
    <Layout>
      <Switch>
        <Route path="/login" exact>
          <Login redirectRoute={redirectRoute} />
        </Route>
        <Route path="/logout" exact>
          <Login redirectRoute={redirectRoute} logout={true}/>
        </Route>
        <Route path="/unsubscribe/:id" exact>
          <Unsubscribe />
        </Route>
        <Route path="/email/view/:id" exact>
          <EmailView />
        </Route>
        <Route path="/help" exact>
          <Help />
        </Route>
        {auth ?
          <Switch>
            <Route path="/compose" exact>
              <App />
            </Route>
            <Route path="/compose/:id" exact>
              <App fromDraft={true} />
            </Route>
            <Route path="/groups" exact>
              <Groups />
            </Route>
            <Route path="/groups/:id" exact>
              <Group />
            </Route>
            <Route path="/emails" exact>
              <Emails />
            </Route>
            <Route path="/settings" exact>
              <Settings />
            </Route> 
            <Route path="/email/:id" exact>
              <Email />
            </Route> 
            <Route path="/gmail" exact>
              <GmailOAuth2 />
            </Route> 
            <Route path="*">
              <NotFound />
            </Route>
          </Switch> : <Redirect to="/login" />
        }
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  )
}