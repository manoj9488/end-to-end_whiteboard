// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"

// export const useMediaDevices = () => {
//   const [stream, setStream] = useState(null)
//   const [micOn, setMicOn] = useState(true)
//   const [cameraOn, setCameraOn] = useState(true)
//   const [screenSharing, setScreenSharing] = useState(false)
//   const originalStreamRef = useRef(null)

//   const getUserMedia = useCallback(async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       })
//       setStream(mediaStream)
//       originalStreamRef.current = mediaStream
//       return mediaStream
//     } catch (error) {
//       console.error("Error accessing media devices:", error)
//       throw error
//     }
//   }, [])

//   const toggleMic = useCallback(() => {
//     if (stream?.getAudioTracks()[0]) {
//       const enabled = !micOn
//       stream.getAudioTracks()[0].enabled = enabled
//       setMicOn(enabled)
//     }
//   }, [stream, micOn])

//   const toggleCamera = useCallback(() => {
//     if (stream?.getVideoTracks()[0]) {
//       const enabled = !cameraOn
//       stream.getVideoTracks()[0].enabled = enabled
//       setCameraOn(enabled)
//     }
//   }, [stream, cameraOn])

//   const startScreenShare = useCallback(
//     async (peersRef) => {
//       if (!stream) return

//       try {
//         const screenStream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         })

//         const screenTrack = screenStream.getVideoTracks()[0]

//         // Replace video track for all peers
//         peersRef.current.forEach(({ peer }) => {
//           const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video")
//           if (sender) sender.replaceTrack(screenTrack)
//         })

//         setScreenSharing(true)

//         // Handle screen share end
//         screenTrack.onended = () => {
//           stopScreenShare(peersRef)
//         }

//         return screenStream
//       } catch (error) {
//         console.error("Error sharing screen:", error)
//         throw error
//       }
//     },
//     [stream],
//   )

//   const stopScreenShare = useCallback((peersRef) => {
//     if (originalStreamRef.current) {
//       const originalTrack = originalStreamRef.current.getVideoTracks()[0]

//       peersRef.current.forEach(({ peer }) => {
//         const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video")
//         if (sender && originalTrack) {
//           sender.replaceTrack(originalTrack)
//         }
//       })
//     }

//     setScreenSharing(false)
//   }, [])

//   const cleanup = useCallback(() => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop())
//     }
//   }, [stream])

//   useEffect(() => {
//     return () => {
//       cleanup()
//     }
//   }, [cleanup])

//   return {
//     stream,
//     micOn,
//     cameraOn,
//     screenSharing,
//     getUserMedia,
//     toggleMic,
//     toggleCamera,
//     startScreenShare,
//     stopScreenShare,
//     cleanup,
//   }
// }





"use client"

import { useState, useRef, useCallback } from "react"

export const useMediaDevices = () => {
  const [localStream, setLocalStream] = useState(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isSharingScreen, setIsSharingScreen] = useState(false)
  const [screenStream, setScreenStream] = useState(null)
  const originalStreamRef = useRef(null)
  const screenStreamRef = useRef(null)

  const getUserMedia = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setLocalStream(stream)
      originalStreamRef.current = stream
      return stream
    } catch (error) {
      console.error("Error accessing media devices:", error)
      throw error
    }
  }, [])

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn
        setIsCameraOn(!isCameraOn)
      }
    }
  }, [localStream, isCameraOn])

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
        setIsMicOn(!isMicOn)
      }
    }
  }, [localStream, isMicOn])

  const startScreenShare = useCallback(async () => {
    try {
      const screenMediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      setScreenStream(screenMediaStream)
      screenStreamRef.current = screenMediaStream
      setIsSharingScreen(true)

      // Handle screen share end
      screenMediaStream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

      return screenMediaStream
    } catch (error) {
      console.error("Error starting screen share:", error)
      throw error
    }
  }, [])

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop())
      setScreenStream(null)
      screenStreamRef.current = null
    }
    setIsSharingScreen(false)
  }, [])

  const replaceVideoTrack = useCallback(async (peers, newVideoTrack) => {
    // Replace video track for all peer connections
    Object.values(peers).forEach((peerData) => {
      const { peer } = peerData
      if (peer && peer._pc) {
        const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video")
        if (sender) {
          sender.replaceTrack(newVideoTrack).catch((err) => {
            console.error("Error replacing track:", err)
          })
        }
      }
    })
  }, [])

  const switchToScreenShare = useCallback(
    async (peers) => {
      try {
        const screenMediaStream = await startScreenShare()
        const screenVideoTrack = screenMediaStream.getVideoTracks()[0]

        if (screenVideoTrack) {
          await replaceVideoTrack(peers, screenVideoTrack)
        }

        return screenMediaStream
      } catch (error) {
        console.error("Error switching to screen share:", error)
        throw error
      }
    },
    [startScreenShare, replaceVideoTrack],
  )

  const switchBackToCamera = useCallback(
    async (peers) => {
      try {
        stopScreenShare()

        if (originalStreamRef.current) {
          const cameraVideoTrack = originalStreamRef.current.getVideoTracks()[0]
          if (cameraVideoTrack) {
            await replaceVideoTrack(peers, cameraVideoTrack)
          }
        }
      } catch (error) {
        console.error("Error switching back to camera:", error)
        throw error
      }
    },
    [stopScreenShare, replaceVideoTrack],
  )

  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [localStream])

  return {
    localStream,
    screenStream,
    isCameraOn,
    isMicOn,
    isSharingScreen,
    getUserMedia,
    toggleCamera,
    toggleMic,
    startScreenShare,
    stopScreenShare,
    switchToScreenShare,
    switchBackToCamera,
    cleanup,
  }
}
