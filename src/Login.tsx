import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './Init';
import netlifyIdentity from 'netlify-identity-widget';
import { useHistory } from 'react-router-dom';

type Props = { 
  redirectRoute: string
}

export const Login: FC<Props> = ({ redirectRoute }: Props) => {
  const auth = useAuth()
  const history = useHistory();


  if (!auth) {
    netlifyIdentity.open();
  } else {
    netlifyIdentity.close();
  }

  useEffect(() => {
    if (auth) history.replace(redirectRoute)
  }, [auth])

  return (<>
    <p>login</p>
  </>)
}