
import { User } from "./authorization/user";

window.onload = () => {

  const tsUser = new User("Andreas Wenzelhuemer");
  console.log(tsUser);
};