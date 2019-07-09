var webview = require("@system.webview")
var prompt = require("@system.prompt")
var clipboard = require("@system.clipboard")
var calendar = require("@system.calendar")
var device = require("@system.device")
var fetch = require("@system.fetch")
var file = require("@system.file")
var geolocation = require("@system.geolocation")
var image = require("@system.image")
var media = require("@system.media")
var notification = require("@system.notification")
var barcode = require("@system.barcode")
var sensor = require("@system.sensor")
var share = require("@system.share")
var shortcut = require("@system.shortcut")
var storage = require("@system.storage")
var vibrator = require("@system.vibrator")
var network = require("@system.network")
var request = require("@system.request")
var audio = require("@system.audio")
var volume = require("@system.volume")
var battery = require("@system.battery")
var brightness = require("@system.brightness")
var pkg = require("@system.package")
var record = require("@system.record")
var sms = require("@system.sms")
var websocketfactory = require("@system.websocketfactory")
var wifi = require("@system.wifi")
var contact = require("@system.contact")
var router = require("@system.router")
var app = require("@system.app")

module.exports = {
    webview: webview,
    prompt: prompt,
    clipboard: clipboard,
    calendar: calendar,
    device: device,
    fetch: fetch,
    file: file,
    geolocation: geolocation,
    image: image,
    media: media,
    notification: notification,
    barcode: barcode,
    sensor: sensor,
    share: share,
    shortcut: shortcut,
    storage: storage,
    vibrator: vibrator,
    network: network,
    request: request,
    audio: audio,
    volume: volume,
    battery: battery,
    brightness: brightness,
    pkg: pkg,
    record: record,
    sms: sms,
    websocketfactory: websocketfactory,
    wifi: wifi,
    contact: contact,
    router: router,
    app: app
}