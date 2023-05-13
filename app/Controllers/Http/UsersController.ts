import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Env from "@ioc:Adonis/Core/Env";
export default class UsersController {
  sender = Env.get("EMAIL");
  newUserSchema = schema.create({
    name: schema.string(),
    password: schema.string(),
    email: schema.string([rules.email()]),
    role_id: schema.number(),
  });

  async index({ response }) {
    try {
      const users = await User.query().preload("role");

      return response.status(200).json(users);
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        error: "Erro ao listar os usuários.",
        messages: error.messages,
      });
    }
  }

  async inative({ response, request }) {
    try {
      let id = request.param("id");
      let user = await User.findOrFail(id);
      user.ativo = !user.ativo;
      await user.save();
      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json({
        messages: error.messages,
      });
    }
  }

 

  gerarSenha(tamanho) {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>?";
    let senha = "";

    for (let i = 0; i < tamanho; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return senha;
  }

  async store({ request, response }) {
    try {
      const payload = await request.validate({
        schema: this.newUserSchema,
      });
      const userEmail = await User.findBy("email", payload.email);
      if (userEmail)
        return response.status(409).json({ error: "Email já existente" });

      let newUser = {
        email:payload.email,
        password:payload.password,
        name:payload.name,
        role_id:payload.role_id,
        ativo:true
      }

      const user = await User.create(newUser);

      

      return response.status(201).json({ user });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ error: error.message, messages: error });
    }
  }

  async show({ params, response }) {
    try {
      const user = await User.findOrFail(params.id);

      return response.status(200).json(user);
    } catch (error) {
      return response
        .status(404)
        .json({ error: "Usuário não encontrado.", messages: error });
    }
  }

  async update({ params, request, response }) {
    try {
      const payload = await request.validate({
        schema: this.newUserSchema,
      });
      const userData = payload;
      const user = await User.findOrFail(params.id);
      user.merge(userData);

      await user.save();
      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao atualizar o usuário.",
        messages: error,
      });
    }
  }

  async destroy({ params, response }) {
    try {
      const user = await User.findOrFail(params.id);
      await user.softDelete();
      return response.status(204).json(null);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao excluir o usuário.",
        messages: error,
      });
    }
  }
}
