import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Produto from "App/Models/Produto";

export default class ProdutosController {
  async index({ response }) {
    try {
      const produtos = await Produto.query().preload("categoria");

      return response.status(200).json(produtos);
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        error: "Erro ao listar os usuários.",
        messages: error.messages,
      });
    }
  }

  async store({ request, response }) {
    let body = request.body();
    try {
      const produto = await Produto.findBy("name", body.name);
      if (produto)
        return response.status(409).json({ error: "produto já existente" });

      const user = await Produto.create(body);

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
      const produto = await Produto.findOrFail(params.id);
      await produto.load("categoria");
      return response.status(200).json(produto);
    } catch (error) {
      return response
        .status(404)
        .json({ error: "Usuário não encontrado.", messages: error });
    }
  }

  async update({ params, request, response }) {
    let body = request.body();
    try {
      const user = await Produto.findOrFail(params.id);
      user.merge(body);

      await user.save();
      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao atualizar o produto.",
        messages: error,
      });
    }
  }

  async destroy({ params, response }) {
    try {
      const produto = await Produto.findOrFail(params.id);
      await produto.delete();
      return response.status(204).json(null);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao excluir o usuário.",
        messages: error,
      });
    }
  }
}
