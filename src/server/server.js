"use strict"
const path = require("path")
const escpos = require("escpos")
escpos.USB = require("escpos-usb")

const device = new escpos.USB()
const options = { encoding: "GB18030" }
const printer = new escpos.Printer(device, options)

var bodyParser = require("body-parser")
var app = require("express")()
var http = require("http").Server(app)
var cors = require("cors")
app.use(cors())
app.use(bodyParser.json())

const port = 4000

app.post("/print", (req, res) => {
  res.json({ status: "success" })
  console.log(req.body)
  print("Hello")
})

http.listen(port, () => {
  console.log(`Printer: http://localhost:${port}`)
})

const print = (data) => {
  device.open(function () {
    printer
      .font("a")
      .align("ct")
      .style("bu")
      .size(1, 1)
      .text("SUSAMOGUS")
      .text(data)
      // .barcode(data.code, "EAN13")
      .cut()
      .close()
  })
}
