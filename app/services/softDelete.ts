import {DateTime} from 'luxon';
import {BaseModel, LucidRow, ModelQueryBuilderContract} from "@ioc:Adonis/Lucid/Orm";
// Optional null check query
export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull('deleted_at')
}
export const softDelete = async (row: LucidRow, column: string = 'deletedAt') => {
  row[column] = DateTime.local();
  await row.save();

}