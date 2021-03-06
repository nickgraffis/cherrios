import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { IdentityContext, useAuth } from './Init';
import netlifyIdentity from 'netlify-identity-widget';
import { useHistory } from 'react-router-dom';

type Props = { 
  redirectRoute: string,
  logout: boolean
}

export const Login: FC<Props> = ({ redirectRoute, logout }: Props) => {
  const auth = useAuth()
  const history = useHistory();


  if (!auth) {
    netlifyIdentity.open();
  } else {
    netlifyIdentity.close();
  }

  if (logout) {
    netlifyIdentity.logout();
    history.replace('/login')
  }

  useEffect(() => {
    if (auth) history.replace(redirectRoute)
  }, [auth])

  return (<>
    <p>login</p>
  </>)
}