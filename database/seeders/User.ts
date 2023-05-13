import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Role from "App/Models/Role";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const roleAdm = {
      nome: "Administração",
    };

    const roleGestor = {
      nome: "Gestor",
    };
    const rolePadrao = {
      nome: "Usuário Padrão",
    };
    const userAdmin = {
      name: "admin",
      email: "admin@email.com",
      password: "admin",
      ativo: true,
      role_id: 1,
    };
    const usergestor = {
      name: "gestor",
      email: "gestor@email.com",
      password: "admin",
      ativo: true,
      role_id: 2,
    };
    const userPadrao = {
      name: "padrão",
      email: "padrão@email.com",
      password: "admin",
      ativo: true,
      role_id: 3,
    };
    await Role.create(roleAdm);
    await Role.create(rolePadrao);
    await Role.create(roleGestor);
    await User.create(userAdmin);
    await User.create(usergestor);
    await User.create(userPadrao);
  }
}
