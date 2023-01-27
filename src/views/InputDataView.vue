<script setup>
import { Icon } from "@iconify/vue"
import { onMounted, ref } from "vue"
import { dateForQuery, dateToday } from "../utils/handleDate"
import { insertData } from "../utils/insertData"
import { getDataByQuery } from "../utils/getDataByQuery"

const date = new Date()
const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0")
}

const parkingCode = ref(
  `D${padTo2Digits(date.getDate())}${padTo2Digits(
    date.getMonth() + 1
  )}${date.getFullYear()}T${padTo2Digits(date.getHours())}${padTo2Digits(
    date.getMinutes()
  )}${padTo2Digits(date.getSeconds())}`
)

const inputTime = ref(dateForQuery)
const inputCategory = ref(1)
const dataKarcis = ref([])

const categoriesKendaraan = ref([
  {
    id: 1,
    kendaraan: "motor",
  },
  {
    id: 2,
    kendaraan: "mobil",
  },
])

const addParkirMotor = async () => {
  try {
    const inputTimeData = inputTime.value
    const parkingCodeData = parkingCode.value

    const newParkir = await insertData("laporan", {
      jenis_kendaraan: 1,
      waktu_masuk: inputTimeData,
      kode_parkir: parkingCodeData,
    })

    const newKarcis = await getDataByQuery(
      "laporan",
      "*",
      dataKarcis,
      "kode_parkir",
      parkingCodeData
    ).then(() => {
      window.print()
    })

    if (!newParkir) {
      return
    }
  } catch (err) {
    console.log("There was an error", err)
  }
}

onMounted(() => {
  JsBarcode("#barcode", parkingCode.value, {
    lineColor: "#000",
    displayValue: true,
  })
})
</script>

<template>
  <section class="print:hidden lg:pr-[10vw] grid grid-cols-2 gap-12">
    <button @click="addParkirMotor" class="button-primary text-4xl">
      motor
      <Icon class="mx-auto text-6xl text-white" icon="ri:motorbike-fill" />
    </button>
    <!-- <button class="button-primary text-4xl">
      mobil

      <Icon
        class="mx-auto text-6xl text-white"
        icon="ic:baseline-directions-car"
      />
    </button> -->
  </section>

  <div
    v-if="dataKarcis !== []"
    class="hidden print:flex bg-white text-black items-center flex-col mx-auto w-fit p-4 font-mono border"
  >
    <h2 class="text-3xl uppercase tracking-wide">tiket parkir</h2>
    <p class="uppercase tracking-wide">smk negeri 7</p>
    <!-- <p class="capitalize tracking-wide">tiket no {{ dataKarcis[0]?.id }}</p> -->
    <p class="capitalize tracking-wide">{{ dateToday }}</p>

    <svg id="barcode"></svg>
  </div>
</template>
