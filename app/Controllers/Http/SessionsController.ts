import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(["email", "password"]);

    try {
      const user = await User.findByOrFail("email", email);
      if(!user.ativo) return response.unauthorized("Invalid credentials");
      
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "2hours",
      });
      return response.ok({ user, token });
    } catch {
      return response.unauthorized("Invalid credentials");
    }
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout();
    return response.ok({});
  }
}
