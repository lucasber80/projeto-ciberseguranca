import { DateTime } from "luxon";
import CategoriaProduto from "./CategoriaProduto";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";


export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public categoria_id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public quantity: number;


  @belongsTo(() => CategoriaProduto, {
    foreignKey: 'categoria_id'
  })
  public categoria: BelongsTo<typeof CategoriaProduto>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}


