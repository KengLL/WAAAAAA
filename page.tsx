"use client"

import { useEffect, useRef, useState } from "react"

type Phase = "intro" | "ready" | "rolling" | "result" | "playing"

export default function WaExperience() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [displayPercent, setDisplayPercent] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    introAudioRef.current?.play().catch(() => {})
    const timer = setTimeout(() => setPhase("ready"), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== "result") return
    const glitchLoop = setInterval(() => {
      if (Math.random() > 0.65) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 60 + Math.random() * 100)
      }
    }, 500)
    return () => clearInterval(glitchLoop)
  }, [phase])

  const rollPercentage = () => {
    setPhase("rolling")
    let ticks = 0
    const interval = setInterval(() => {
      setDisplayPercent(Math.floor(Math.random() * 101))
      ticks++
      if (ticks > 28) {
        clearInterval(interval)
        const finalValue = Math.floor(Math.random() * 101)
        setDisplayPercent(finalValue)
        setPhase("result")
        setTimeout(() => triggerVideo(finalValue), 2500)
      }
    }, 55)
  }

  const triggerVideo = (value: number) => {
    setPhase("playing")
    if (!videoRef.current) return
    if (value < 25) videoRef.current.src = "/wa1.mp4"
    else if (value < 50) videoRef.current.src = "/wa2.mp4"
    else if (value < 75) videoRef.current.src = "/wa3.mp4"
    else videoRef.current.src = "/wa4.mp4"
    videoRef.current.play()
    videoRef.current.onended = () => {
      setPhase("intro")
      setDisplayPercent(0)
      introAudioRef.current?.play().catch(() => {})
      setTimeout(() => setPhase("ready"), 3000)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #E5E5E5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Black Han Sans', sans-serif;
        }

        .screen {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #E5E5E5;
          position: relative;
          overflow: hidden;
        }

        /* Scanlines - very subtle */
        .screen::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.015) 3px,
            rgba(0,0,0,0.015) 4px
          );
          pointer-events: none;
          z-index: 100;
        }

        .intro-text {
          font-size: 80px;
          font-weight: 900;
          color: #111;
          text-align: center;
          animation: pulse 1.2s ease-in-out infinite;
          line-height: 1.05;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .play-btn {
          font-family: 'Black Han Sans', sans-serif;
          font-size: 52px;
          padding: 16px 56px;
          background: #111;
          color: #E5E5E5;
          border: none;
          cursor: pointer;
          box-shadow: 6px 6px 0 rgba(0,0,0,0.25);
          transition: all 0.1s;
          letter-spacing: 2px;
        }
        .play-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 rgba(0,0,0,0.25);
        }

        /* Glitch number */
        .glitch-wrap {
          position: relative;
          display: inline-block;
          line-height: 1;
        }

        .glitch-number {
          font-size: 160px;
          font-weight: 900;
          color: #111;
          line-height: 1;
          position: relative;
          z-index: 2;
          font-family: 'Black Han Sans', sans-serif;
        }

        /* Very faint chromatic ghost layers */
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          font-size: 160px;
          font-weight: 900;
          font-family: 'Black Han Sans', sans-serif;
          line-height: 1;
          z-index: 1;
          pointer-events: none;
          opacity: 0.15;
        }
        /* Red channel */
        .glitch-wrap::before {
          color: #c00;
          transform: translate(-2px, 1px);
          mix-blend-mode: multiply;
        }
        /* Blue channel */
        .glitch-wrap::after {
          color: #00c;
          transform: translate(2px, -1px);
          mix-blend-mode: multiply;
        }

        /* Active glitch: brief stronger shift */
        .glitch-wrap.active::before {
          animation: ca-r 0.12s steps(2) infinite;
        }
        .glitch-wrap.active::after {
          animation: ca-b 0.12s steps(2) infinite;
        }
        .glitch-wrap.active .glitch-number {
          animation: ca-main 0.12s steps(2) infinite;
        }

        @keyframes ca-r {
          0%   { transform: translate(-4px, 1px); }
          50%  { transform: translate(-2px, 2px); }
          100% { transform: translate(-4px, 1px); }
        }
        @keyframes ca-b {
          0%   { transform: translate(4px, -1px); }
          50%  { transform: translate(2px, -2px); }
          100% { transform: translate(4px, -1px); }
        }
        @keyframes ca-main {
          0%   { transform: translateX(1px); }
          50%  { transform: translateX(-1px); }
          100% { transform: translateX(1px); }
        }

        /* Fast flicker during roll */
        .rolling-flicker {
          animation: flicker 0.08s infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          40%      { opacity: 0.88; }
          70%      { opacity: 0.94; }
        }

        /* Static bar at bottom */
        .static-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: repeating-linear-gradient(
            90deg,
            #bbb 0px, #999 2px, #ddd 3px, #aaa 5px,
            #ccc 6px, #888 8px, transparent 9px, transparent 14px
          );
          opacity: 0.45;
          z-index: 50;
        }

        .static-dots {
          position: fixed;
          bottom: 20px;
          left: 0;
          right: 0;
          height: 10px;
          display: flex;
          gap: 50px;
          padding: 0 80px;
          align-items: center;
          z-index: 50;
        }
        .static-dots span {
          display: block;
          width: 8px;
          height: 2px;
          background: #aaa;
          opacity: 0.5;
        }

        /* Left edge colour bleed */
        .edge-bleed {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: linear-gradient(180deg,
            transparent 15%,
            rgba(200,0,0,0.4) 28%, transparent 32%,
            transparent 52%,
            rgba(0,0,200,0.4) 65%, transparent 70%
          );
          z-index: 50;
        }

        video.fullscreen-video {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 200;
        }
      `}</style>

      <div className="screen">

        {phase === "intro" && (
          <div className="intro-text">HOW TO<br />SAY "WA"</div>
        )}

        {phase === "ready" && (
          <button className="play-btn" onClick={rollPercentage}>▶ PLAY</button>
        )}

        {(phase === "rolling" || phase === "result") && (
          <>
            <div
              className={`glitch-wrap ${phase === "rolling" ? "rolling-flicker" : ""} ${phase === "result" && glitchActive ? "active" : ""}`}
              data-text={`${displayPercent}%`}
            >
              <div className="glitch-number">{displayPercent}%</div>
            </div>

            {phase === "result" && (
              <>
                <div className="edge-bleed" />
                <div className="static-dots">
                  <span /><span /><span /><span /><span />
                </div>
                <div className="static-bar" />
              </>
            )}
          </>
        )}

      </div>

      {/* Always keep video mounted to avoid ref timing issues */}
      <video
        ref={videoRef}
        className={phase === "playing" ? "fullscreen-video" : ""}
        style={phase !== "playing" ? { display: "none" } : undefined}
      />

      <audio ref={introAudioRef} src="/intro.mp3" />
    </>
  )
}
