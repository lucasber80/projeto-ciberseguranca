import BaseSchema from "@ioc:Adonis/Lucid/Schema";


export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("email", 255).notNullable().unique();
      table.string("name", 255).notNullable();
      table.boolean("ativo").notNullable();
      table.string("password", 180).notNullable();
      table.string("remember_me_token").nullable();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("deleted_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });

   
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
