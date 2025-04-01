/**
 * Represents the payload of the response received when registering a new user in Firebase
 * @see https://firebase.google.com/docs/reference/rest/auth?hl=fr#section-create-email-password
 */
export interface FirebaseResponseSignup {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
