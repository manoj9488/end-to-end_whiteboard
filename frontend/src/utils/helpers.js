

export const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy text: ", err)
    return false
  }
}

export const getUsername = () => {
  return localStorage.getItem("username") || "Guest"
}

export const playNotificationSound = () => {
  try {
    const audio = new Audio("/notification.mp3")
    audio.volume = 0.3
    audio.play().catch((e) => console.log("Audio play failed:", e))
  } catch (error) {
    console.log("Notification sound not available")
  }
}

export const requestPictureInPicture = async (videoElement) => {
  try {
    if (videoElement && document.pictureInPictureEnabled && !videoElement.disablePictureInPicture) {
      await videoElement.requestPictureInPicture()
    }
  } catch (error) {
    console.error("Picture-in-Picture failed:", error)
  }
}

export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
