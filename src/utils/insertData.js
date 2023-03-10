import { supabase } from "../global/supabase"

export const insertData = async (table, dataInput) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(dataInput)
      .single()

    console.log("data berhasil ditambahkan", dataInput)
    console.log(data)

    if (error) throw error

    console.log("data berhasil ditambahkan")
  } catch (err) {
    console.log(err.message)
  }
}
