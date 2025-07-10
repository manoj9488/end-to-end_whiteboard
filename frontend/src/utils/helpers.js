// export const copyToClipboard = async (text) => {
//   try {
//     await navigator.clipboard.writeText(text)
//     return true
//   } catch (err) {
//     console.error("Failed to copy text: ", err)
//     return false
//   }
// }

// export const playNotificationSound = (soundPath = "/sounds/pop.mp3") => {
//   try {
//     const audio = new Audio(soundPath)
//     audio.play().catch((err) => console.log("Audio play failed:", err))
//   } catch (err) {
//     console.log("Audio creation failed:", err)
//   }
// }

// export const formatTime = (timestamp) => {
//   const date = new Date(timestamp)
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// }

// export const generateEmojiId = () => {
//   return `emoji_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
// }

// export const requestPictureInPicture = (videoElement) => {
//   if (videoElement && videoElement.requestPictureInPicture) {
//     videoElement.requestPictureInPicture().catch((err) => {
//       console.log("PiP request failed:", err)
//     })
//   }
// }

// export const getUsername = () => {
//   return localStorage.getItem("username") || JSON.parse(localStorage.getItem("user") || "{}").name || "Guest"
// }

// export const validateRoomId = (roomId) => {
//   return roomId && roomId.trim().length > 0
// }



export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy text: ", err)
    return false
  }
}

export const playNotificationSound = (soundPath = "/sounds/pop.mp3") => {
  try {
    const audio = new Audio(soundPath)
    audio.play().catch((err) => console.log("Audio play failed:", err))
  } catch (err) {
    console.log("Audio creation failed:", err)
  }
}

export const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export const generateEmojiId = () => {
  return `emoji_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const requestPictureInPicture = (videoElement) => {
  if (videoElement && videoElement.requestPictureInPicture) {
    videoElement.requestPictureInPicture().catch((err) => {
      console.log("PiP request failed:", err)
    })
  }
}

export const getUsername = () => {
  return localStorage.getItem("username") || JSON.parse(localStorage.getItem("user") || "{}").name || "Guest"
}

export const validateRoomId = (roomId) => {
  return roomId && roomId.trim().length > 0
}

export const getOptimalVideoConstraints = () => {
  return {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: "user",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  }
}

export const getScreenShareConstraints = () => {
  return {
    video: {
      cursor: "always",
      displaySurface: "monitor",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  }
}

export const calculateGridLayout = (participantCount) => {
  if (participantCount <= 1) return { cols: 1, rows: 1 }
  if (participantCount <= 2) return { cols: 2, rows: 1 }
  if (participantCount <= 4) return { cols: 2, rows: 2 }
  if (participantCount <= 6) return { cols: 3, rows: 2 }
  if (participantCount <= 9) return { cols: 3, rows: 3 }
  return { cols: 4, rows: Math.ceil(participantCount / 4) }
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
