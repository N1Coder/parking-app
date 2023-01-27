<script setup>
import { dateToday } from "../utils/handleDate"
import { currency } from "../utils/currency"
import { onMounted, ref } from "vue"
import { getDataByDate } from "../utils/getDataByDate"

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0")
}

const dataToday = ref([]),
  totalPemasukan = ref(0)

const date = new Date()
const year = date.getFullYear()
const dateStart = `${year}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(
  date.getDate()
)}T00:00`
const dateEnd = `${year}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(
  date.getDate()
)}T23:59`

onMounted(async () => {
  await getDataByDate(
    "laporan",
    "*",
    dataToday,
    "waktu_masuk",
    dateStart,
    dateEnd
  )
  dataToday.value.map((tarif) => {
    totalPemasukan.value += Number(tarif.tarif)
  })
})
</script>

<template>
  <section class="">
    <header class="text-2xl font-semibold">
      <h2 class="capitalize">aplikasi parkir</h2>
      <p class="text-lg">Overview hari {{ dateToday }}</p>
    </header>

    <div class="grid grid-cols-3 mt-4 gap-4">
      <div class="p-4 bg-slate-700 rounded capitalize">
        <h3 class="font-semibold text-xl">jumlah kendaraan hari ini</h3>
        <p>{{ dataToday.length }}</p>
      </div>
      <div class="p-4 bg-slate-700 rounded capitalize">
        <h3 class="font-semibold text-xl">jumlah pendapatan hari ini</h3>
        <p>Rp {{ currency(totalPemasukan) }},00</p>
      </div>
    </div>
  </section>
</template>
