import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "App/Models/Log";

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

  async store({ request, response, auth }) {
    let body = request.body();
    try {
      const produto = await Produto.findBy("name", body.name);
      if (produto)
        return response.status(409).json({ error: "produto já existente" });

      const newProduto = await Produto.create(body);
      let log = new Log();
      log.operation = "create";
      log.user_name = auth.user.name;
      log.table = "produtos";
      log.item_id = newProduto.id;
      await log.save();
      return response.status(201).json({ newProduto });
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

  async update({ params, request, response, auth }) {
    let body = request.body();
    try {
      const newProduto = await Produto.findOrFail(params.id);
      newProduto.merge(body);

      await newProduto.save();

      let log = new Log();
      log.operation = "update";
      log.user_name = auth.user.name;
      log.table = "produtos";
      log.item_id = newProduto.id;
      await log.save();
      return response.status(200).json(newProduto);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao atualizar o produto.",
        messages: error,
      });
    }
  }

  async destroy({ params, response, auth }) {
    try {
      const produto = await Produto.findOrFail(params.id);
      let log = new Log();
      log.operation = "delete";
      log.user_name = auth.user.name;
      log.table = "produtos";
      log.item_id = produto.id;
      await log.save();
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
