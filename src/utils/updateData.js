import { supabase } from "../global/supabase"

export const updateData = async (table, value, query, queryVal) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(value)
      .eq(`${query}`, `${queryVal}`)

    if (error) throw error
  } catch (err) {
    console.log(err.message)
  }
}
