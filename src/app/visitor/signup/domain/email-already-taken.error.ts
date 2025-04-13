export class EmailAlreadyTakenError extends Error {
  constructor(readonly email: string) {
    super(`Email ${email} is already taken. Please try another one.`);
    this.name = 'EmailAlreadyTakenError';
  }
}
