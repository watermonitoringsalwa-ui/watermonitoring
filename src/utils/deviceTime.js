/**
 * Get current time in local device timezone
 */
export function getNowLocal() {
  return new Date()
}

/**
 * Format timestamp to local device time display (HH:MM:SS)
 * Takes into account user's browser timezone
 */
export function formatTimeLocal(isoTimestamp) {
  if (!isoTimestamp) return ''
  try {
    const date = new Date(isoTimestamp)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  } catch {
    return ''
  }
}

/**
 * Generates time-based chart data points using device time
 * Creates an array of timestamps with specified intervals
 * Uses local browser timezone
 */
export function generateDeviceTimePoints(minutes = 80, intervalMinutes = 1) {
  const now = getNowLocal()
  const points = []
  
  // Generate time points going backwards from now
  for (let i = minutes; i >= 0; i -= intervalMinutes) {
    const time = new Date(now.getTime() - i * 60 * 1000)
    const timestamp = time.toISOString()
    points.push({
      timestamp,
      time,
      displayTime: formatTimeLocal(timestamp),
    })
  }
  
  return points
}

/**
 * Creates empty chart data with device timestamps
 * Merges telemetry history with device time points
 * Uses local browser timezone
 */
export function createChartDataWithDeviceTime(telemetryHistory = [], minutes = 80, intervalMinutes = 1) {
  const devicePoints = generateDeviceTimePoints(minutes, intervalMinutes)
  
  if (!Array.isArray(telemetryHistory) || telemetryHistory.length === 0) {
    return devicePoints.map((p) => ({
      t: p.displayTime,
      timestamp: p.timestamp,
      displayTime: p.displayTime,
    }))
  }
  
  // Create a map of telemetry data indexed by timestamp
  const dataMap = new Map()
  telemetryHistory.forEach((item) => {
    if (item.timestamp) {
      dataMap.set(item.timestamp, item)
    }
  })
  
  // Merge device time points with telemetry data
  return devicePoints.map((p) => {
    const telemetry = dataMap.get(p.timestamp)
    if (telemetry) {
      return {
        ...telemetry,
        t: p.displayTime,
        displayTime: p.displayTime,
      }
    }
    return {
      t: p.displayTime,
      timestamp: p.timestamp,
      displayTime: p.displayTime,
    }
  })
}

/**
 * Ensures chart always has at least current device time visible
 */
export function ensureCurrentDeviceTime(data = []) {
  if (!Array.isArray(data)) {
    return generateDeviceTimePoints(80)
  }
  
  // If data is empty, generate time points
  if (data.length === 0) {
    return generateDeviceTimePoints(80)
  }
  
  return data
}

/**
 * Get the latest timestamp from history or current device time
 */
export function getLatestTimestamp(telemetryHistory = []) {
  if (Array.isArray(telemetryHistory) && telemetryHistory.length > 0) {
    const lastItem = telemetryHistory[telemetryHistory.length - 1]
    if (lastItem?.timestamp) {
      return lastItem.timestamp
    }
  }
  
  return getNowLocal().toISOString()
}
