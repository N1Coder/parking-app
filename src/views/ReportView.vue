<script setup>
import { Icon } from "@iconify/vue"
import { ref, onMounted } from "vue"
import { currency } from "../utils/currency"
import { getAllData } from "../utils/getAllData"
import { getDataByDate } from "../utils/getDataByDate"
import { getDataByQuery } from "../utils/getDataByQuery"
import { dateForQuery, dateToday } from "../utils/handleDate"
import { updateData } from "../utils/updateData"
import Modal from "../components/Modal.vue"

const dataReport = ref([])
const dataKarcis = ref([])
const parkingCode = ref(null)
const modalStatus = ref(false)
const timeInInput = ref(null),
  timeOutInput = ref(dateForQuery),
  firstPlat = ref(null),
  numPlat = ref(null),
  lastPlat = ref(null),
  totalPrice = ref(null)

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0")
}

const searchCode = async () => {
  await getDataByQuery(
    "laporan",
    "kode_parkir",
    dataKarcis,
    "kode_parkir",
    parkingCode.value
  )

  console.log(dataKarcis.value)

  if (dataKarcis.value.length !== 0) {
    try {
      if (parkingCode !== null) {
        modalStatus.value = true

        const searchKarcis = await getDataByQuery(
          "laporan",
          "*",
          dataKarcis,
          "kode_parkir",
          parkingCode.value
        )

        timeInInput.value = dataKarcis.value[0].waktu_masuk
        totalPrice.value =
          2000 *
          Math.abs(
            new Date(timeOutInput.value).getHours() -
              new Date(timeInInput.value).getHours() || 1
          )

        updateData(
          "laporan",
          {
            waktu_keluar: timeOutInput.value,
            tarif: totalPrice.value,
          },
          "kode_parkir",
          parkingCode.value
        )
      }
    } catch (err) {
      console.log(err.message)
    }
  } else {
    alert("Tidak bisa menemukan kode karcis")
  }
}

const inputParking = () => {
  updateData(
    "laporan",
    {
      waktu_keluar: timeOutInput.value,
      tarif: totalPrice.value,
      nomor_plat: `${firstPlat.value.toUpperCase()} ${numPlat.value.toUpperCase()} ${lastPlat.value.toUpperCase()}`,
    },
    "kode_parkir",
    parkingCode.value
  )
    .then(() => {
      updateData(
        "laporan",
        {
          kode_parkir: "",
        },
        "kode_parkir",
        parkingCode.value
      )
    })
    .then(() => {
      alert("Data berhasil diinput")
      modalStatus.value = false
    })
}

const closeModal = () => {
  modalStatus.value = false
}

const date = new Date()
const year = date.getFullYear()
const dateStart = `${year}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(
  date.getDate()
)}T00:00`
const dateEnd = `${year}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(
  date.getDate()
)}T23:59`

const convertTimeStamp = (time) => {
  const timeToDate = new Date(time)

  return `${padTo2Digits(timeToDate.getHours())}:${padTo2Digits(
    timeToDate.getMinutes()
  )}`
}

onMounted(async () => {
  // getAllData("laporan", dataReport)
  await getDataByDate(
    "laporan",
    "*",
    dataReport,
    "waktu_masuk",
    dateStart,
    dateEnd
  )
})
</script>

<template>
  <section>
    <h2 class="text-xl capitalize font-semibold mb-5">cari karcis</h2>
  </section>

  <div class="flex gap-4 mb-4 flex-col max-w-[30rem]">
    <input v-model="parkingCode" class="w-3/4 input-primary" type="text" />
    <button @click="searchCode" class="button-action-edit mt-1 w-1/4">
      cari kode
    </button>

    <form
      v-if="modalStatus"
      @submit.prevent="inputParking"
      class="flex flex-col gap-4"
    >
      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          waktu masuk
        </p>
        <input
          v-model="timeInInput"
          class="input-primary pr-1"
          type="datetime-local"
          required
          disabled
        />
      </label>

      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          waktu keluar
        </p>
        <input
          v-model="timeOutInput"
          class="input-primary pr-1"
          type="datetime-local"
          required
          disabled
        />
      </label>

      <label class="grid grid-cols-3 gap-x-4">
        <p
          class="col-span-3 capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          Plat nomor
        </p>
        <input
          v-model="firstPlat"
          class="input-primary uppercase"
          type="text"
          minlength="2"
          maxlength="2"
          placeholder="AA"
          required
        />
        <input
          v-model="numPlat"
          class="input-primary uppercase"
          type="text"
          minlength="4"
          maxlength="4"
          placeholder="1234"
          required
        />
        <input
          v-model="lastPlat"
          class="input-primary uppercase"
          type="text"
          minlength="2"
          maxlength="3"
          placeholder="ABC"
          required
        />
      </label>

      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          total tarif
        </p>
        <input
          v-model="totalPrice"
          class="input-primary"
          type="number"
          min="100"
          placeholder="Jumlah tarif"
          required
          disabled
        />

        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          Rp. {{ currency(totalPrice || 0) || "0" }},00
        </p>
      </label>

      <input class="button-primary" type="submit" value="Simpan" />
    </form>
  </div>

  <table class="table-auto w-full border-collapse border border-white">
    <!-- <thead>
      <tr>
        <th class="font-semibold uppercase border border-white w-[5%]">no</th>
        <th class="font-semibold uppercase border border-white w-[25%]">
          kendaraan
        </th>
        <th class="font-semibold uppercase border border-white w-[15%]">
          nomor plat
        </th>
        <th class="font-semibold uppercase border border-white w-[15%]">
          waktu masuk
        </th>
        <th class="font-semibold uppercase border border-white w-[15%]">
          waktu keluar
        </th>
        <th class="font-semibold uppercase border border-white w-[15%]">
          tarif
        </th>
         <th class="font-semibold uppercase border border-white w-[10%]">
          aksi
        </th> 
      </tr>
    </thead>

    <tbody>
      <tr v-for="(report, i) in dataReport">
        <td class="border border-white text-center">{{ i + 1 }}</td>
        <td class="first-letter:capitalize border border-white pl-2">
          {{ report.id_kendaraan === 1 ? "mobil" : "motor" }}
        </td>
        <td class="border border-white text-center">
          {{ report.nomor_plat ?? "-" }}
        </td>
        <td class="border border-white text-center">
          {{ convertTimeStamp(report.waktu_masuk) }}
        </td>
        <td class="border border-white text-center">
          {{
            report.waktu_keluar !== null
              ? convertTimeStamp(report.waktu_keluar)
              : "-"
          }}
        </td>
         <td class="border border-white text-center">
           {{ new Date(report.waktu_masuk).getHours() }} 
           {{ new Date(report.waktu_keluar).getHours() }}
          {{
            Math.abs(
              new Date(report.waktu_keluar).getHours() -
                new Date(report.waktu_masuk).getHours()
            )
          }}
        </td> 
        <td class="border border-white text-center">
          {{ report.tarif !== null ? `Rp ${currency(report.tarif)}` : "-" }}
        </td>
         <td class="border border-white text-center">
          <button
            v-if="report.waktu_keluar === null"
            @click="
              updateData(
                'laporan',
                report.id_kendaraan === 1
                  ? {
                      waktu_keluar: dateForQuery,
                      tarif:
                        Math.abs(
                          new Date().getHours() -
                            new Date(report.waktu_masuk).getHours() || 1
                        ) * 2000,
                    }
                  : {
                      waktu_keluar: dateForQuery,
                      tarif:
                        Math.abs(
                          new Date().getHours() -
                            new Date(report.waktu_masuk).getHours() || 1
                        ) * 4000,
                    },
                'id',
                report.id
              )
            "
            class="button-action-delete"
          >
            keluar
          </button>
        </td>
      </tr>
    </tbody> -->
  </table>

  <!-- <div class="p-8 px-6 lg:max-w-md lg:mx-auto">
    <button
      style="margin-left: auto !important"
      @click="closeModal"
      class="button-action-delete block w-fit"
    >
      <Icon class="text-white text-2xl" icon="clarity:window-close-line" />
    </button>

    <form
      @submit.prevent="inputParking"
      class="flex flex-col gap-4 mt-3 py-9 p-7 bg-white dark:bg-slate-900 shadow-sharp border-[3px] border-black"
    >
      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          waktu masuk
        </p>
        <input
          v-model="timeInInput"
          class="input-primary pr-1"
          type="datetime-local"
          required
          disabled
        />
      </label>

      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          waktu keluar
        </p>
        <input
          v-model="timeOutInput"
          class="input-primary pr-1"
          type="datetime-local"
          required
          disabled
        />
      </label>

      <label class="grid grid-cols-3 gap-x-4">
        <p
          class="col-span-3 capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          Plat nomor
        </p>
        <input
          v-model="firstPlat"
          class="input-primary uppercase"
          type="text"
          minlength="2"
          maxlength="2"
          placeholder="AA"
          required
        />
        <input
          v-model="numPlat"
          class="input-primary uppercase"
          type="text"
          minlength="4"
          maxlength="4"
          placeholder="1234"
          required
        />
        <input
          v-model="lastPlat"
          class="input-primary uppercase"
          type="text"
          minlength="2"
          maxlength="3"
          placeholder="ABC"
          required
        />
      </label>

      <label>
        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          total tarif
        </p>
        <input
          v-model="totalPrice"
          class="input-primary"
          type="number"
          min="100"
          placeholder="Jumlah tarif"
          required
          disabled
        />

        <p
          class="capitalize text-lg text-orange-500 dark:text-slate-200 font-medium"
        >
          Rp. {{ currency(totalPrice || 0) || "0" }},00
        </p>
      </label>

      <input class="button-primary" type="submit" value="Simpan" />
    </form>
  </div> -->
</template>
