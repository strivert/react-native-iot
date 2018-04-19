import andersenHttp from '../utils/andersenHttp'

module.exports = {
  postCreateClaimCode,
  getDevices,
  getDevice,
  postSetEnableCharging,
  putRenameDevice,
  putDeviceSerialNumber,
  putDeviceLocation,
  deleteDevice,
  postDevice,
}

function postCreateClaimCode () {
  return andersenHttp.post('particle/v1/device_claims')
}

function getDevices () {
  return andersenHttp.get(`particle/v1/devices`)
}

function getDevice (deviceId) {
  return andersenHttp.get(`particle/v1/devices/${deviceId}`)
}

function deleteDevice (deviceId) {
  return andersenHttp.delete(`particle/unclaim/${deviceId}`)
}
function postDevice (deviceId) {
  return andersenHttp.get(`particle/claim/${deviceId}`)
}

/**
 * Set enablecharging status of device
 * @param {string} deviceId
 * @param {bool} enabled
 */
function postSetEnableCharging (deviceId, enabled) {
  console.log('`devices/${deviceId}/set-remote-locking`', `devices/${deviceId}/set-remote-locking`)
  return andersenHttp.post(`devices/${deviceId}/set-remote-locking`, {
    setTo: !enabled,
  })
}

function putRenameDevice (deviceId, name) {
  return andersenHttp.put(`devices/${deviceId}/name`, {
    name,
  })
}

function putDeviceSerialNumber (deviceId, serialNumber) {
  return andersenHttp.put(`devices/${deviceId}/serial-number`, {
    serialNumber,
  })
}

function putDeviceLocation (deviceId, location) {
  return andersenHttp.put(`devices/${deviceId}/location`, {
    location,
  })
}
