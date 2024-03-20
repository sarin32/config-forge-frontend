export function setSessionToken(token: string) {
  sessionStorage.setItem('token', token);
}

function getSessionToken() {
  return sessionStorage.getItem('token');
}

export function getAuthHeaders() {
  return {Authorization: getSessionToken() || ''};
}
