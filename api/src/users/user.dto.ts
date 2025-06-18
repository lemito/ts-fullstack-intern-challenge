export class UserDTO {
  email: string;
  login: string;
  password: string;

  constructor(email: string, login: string, password: string) {
    this.email = email;
    this.login = login;
    this.password = password;
  }
}
