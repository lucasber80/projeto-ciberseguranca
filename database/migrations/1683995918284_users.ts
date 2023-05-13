import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("role_id", 255).notNullable().unsigned().references('id').inTable('roles');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
