export function isLoggedIn(): boolean {
  return localStorage.getItem("token") !== null;
}

export function logout(): void {
  localStorage.removeItem("token");
}
