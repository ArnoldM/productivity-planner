/**
 * Represents the payload of the response received when logging in a user in Firebase
 * @see https://firebase.google.com/docs/reference/rest/auth?hl=fr#section-sign-in-email-password
 */
export interface FirebaseResponseSignin {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
}
