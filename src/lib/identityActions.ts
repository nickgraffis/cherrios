import netlifyIdentity, { currentUser, refresh } from 'netlify-identity-widget';

export function loginUser() {
  const user = currentUser();

  if (netlifyIdentity && user) {
    localStorage.setItem(
      'currentCheerioUser',
      JSON.stringify({ ...user })
    );
  }
}

export function logoutUser() {
  localStorage.removeItem('currentCheerioUser');
}