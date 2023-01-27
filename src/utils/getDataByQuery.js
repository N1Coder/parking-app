import { supabase } from "../global/supabase"

export const getDataByQuery = async (table, query, dataArr, col, colQuery) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(query)
      .eq(col, colQuery)

    if (error) throw error

    console.log(data)
    dataArr.value = data
  } catch (err) {
    console.log(err.message)
  }
}
