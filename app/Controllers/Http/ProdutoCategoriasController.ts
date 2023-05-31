import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CategoriaProduto from "App/Models/CategoriaProduto";
import Log from "App/Models/Log";

export default class ProdutoCategoriasController {
  async index({ response }) {
    try {
      const produtos = await CategoriaProduto.query();

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
      const produtoCat = await CategoriaProduto.findBy("name", body.name);
      if (produtoCat)
        return response.status(409).json({ error: "categoria já existente" });

      const newCat = await CategoriaProduto.create(body);
      let log = new Log();
      log.operation = "create";
      log.user_name = auth.user.name;
      log.table = "categoria_produtos";
      log.item_id = newCat.id;
      await log.save();
      return response.status(201).json({ newCat });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ error: error.message, messages: error });
    }
  }

  async show({ params, response }) {
    try {
      const produto = await CategoriaProduto.findOrFail(params.id);

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
      const produtoCat = await CategoriaProduto.findOrFail(params.id);
      produtoCat.merge(body);

      await produtoCat.save();
      let log = new Log();
      log.operation = "update";
      log.user_name = auth.user.name;
      log.table = "categoria_produtos";
      log.item_id = produtoCat.id;
      await log.save();
      return response.status(200).json(produtoCat);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao atualizar o produto.",
        messages: error,
      });
    }
  }

  async destroy({ params, response, auth }) {
    try {
      const produtoCat = await CategoriaProduto.findOrFail(params.id);
      let log = new Log();
      log.operation = "delete";
      log.user_name = auth.user.name;
      log.table = "categoria_produtos";
      log.item_id = produtoCat.id;
      await produtoCat.delete();

      await log.save();
      return response.status(204).json(null);
    } catch (error) {
      return response.status(500).json({
        error: "Erro ao excluir o usuário.",
        messages: error,
      });
    }
  }
}
