import { supabase } from "../global/supabase"

export const getAllData = async (table, dataArr) => {
  try {
    const { data, error } = await supabase.from(table).select("*")

    if (error) throw error

    dataArr.value = data
    console.log(data)
  } catch (err) {
    console.log(err.message)
  }
}
