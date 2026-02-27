"use client"

import { useEffect, useRef, useState } from "react"

type Phase = "intro" | "ready" | "rolling" | "result" | "playing"

export default function WaExperience() {
  const [phase, setPhase] = useState<Phase>("intro")
  const [displayPercent, setDisplayPercent] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const [introMuted, setIntroMuted] = useState(true)

  const openingRef = useRef<HTMLVideoElement | null>(null)
  const waVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    openingRef.current?.play().catch(() => {})
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
    setIntroMuted(false)
    setPhase("rolling")
    let ticks = 0
    const interval = setInterval(() => {
      setDisplayPercent(Math.floor(Math.random() * 101))
      ticks++
      if (ticks > 28) {
        clearInterval(interval)
        const final = Math.floor(Math.random() * 101)
        setDisplayPercent(final)
        setPhase("result")
        setTimeout(() => playWa(final), 2500)
      }
    }, 55)
  }

  const playWa = (value: number) => {
    if (!waVideoRef.current) return
    waVideoRef.current.src =
      value < 25 ? "/wa1.mp4" :
      value < 50 ? "/wa2.mp4" :
      value < 75 ? "/wa3.mp4" : "/wa4.mp4"
    setPhase("playing")
    waVideoRef.current.play().catch(() => {})
  }

  const handleWaEnded = () => {
    setDisplayPercent(0)
    setPhase("intro")
    if (openingRef.current) {
      openingRef.current.muted = false
      openingRef.current.currentTime = 0
      openingRef.current.play().catch(() => {})
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; font-family: 'Black Han Sans', sans-serif; }

        .screen {
          min-height: 100vh;
          width: 100%;
          background: #000;
          position: relative;
          overflow: hidden;
        }

        .screen.number-phase {
          background: #fff;
        }

        /* Scanlines */
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

        .center {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .center.lower {
          align-items: flex-end;
          padding-bottom: 13vh;
        }

        .play-btn {
          font-family: 'Black Han Sans', sans-serif;
          font-size: 52px;
          padding: 16px 56px;
          background: #fff;
          color: #000;
          border: none;
          cursor: pointer;
          box-shadow: 6px 6px 0 rgba(255,255,255,0.25);
          transition: all 0.1s;
          letter-spacing: 2px;
        }
        .play-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 rgba(255,255,255,0.25);
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
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          font-size: 160px;
          font-weight: 900;
          font-family: 'Black Han Sans', sans-serif;
          line-height: 1;
          z-index: 1;
          pointer-events: none;
          opacity: 0.2;
        }
        .glitch-wrap::before {
          color: #c00;
          transform: translate(-2px, 1px);
          mix-blend-mode: multiply;
        }
        .glitch-wrap::after {
          color: #00c;
          transform: translate(2px, -1px);
          mix-blend-mode: multiply;
        }
        .glitch-wrap.active::before { animation: ca-r 0.12s steps(2) infinite; }
        .glitch-wrap.active::after  { animation: ca-b 0.12s steps(2) infinite; }
        .glitch-wrap.active .glitch-number { animation: ca-main 0.12s steps(2) infinite; }
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

        .rolling-flicker { animation: flicker 0.08s infinite; }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          40%      { opacity: 0.88; }
          70%      { opacity: 0.94; }
        }

        .static-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 20px;
          background: repeating-linear-gradient(
            90deg,
            #555 0px, #333 2px, #777 3px, #444 5px,
            #666 6px, #222 8px, transparent 9px, transparent 14px
          );
          opacity: 0.45;
          z-index: 50;
        }
        .static-dots {
          position: fixed;
          bottom: 20px; left: 0; right: 0;
          height: 10px;
          display: flex;
          gap: 50px;
          padding: 0 80px;
          align-items: center;
          z-index: 50;
        }
        .static-dots span {
          display: block;
          width: 8px; height: 2px;
          background: #666;
          opacity: 0.5;
        }
        .edge-bleed {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 5px;
          background: linear-gradient(180deg,
            transparent 15%,
            rgba(200,0,0,0.4) 28%, transparent 32%,
            transparent 52%,
            rgba(0,0,200,0.4) 65%, transparent 70%
          );
          z-index: 50;
        }
      `}</style>

      <div className={`screen ${phase === "rolling" || phase === "result" ? "number-phase" : ""}`}>

        {/* Opening video — muted so it can autoplay */}
        <video
          ref={openingRef}
          src="/opening.mp4"
          className={`absolute inset-0 w-full h-full object-cover ${
            phase === "rolling" || phase === "result" || phase === "playing" ? "hidden" : ""
          }`}
          onEnded={() => setPhase("ready")}
          playsInline
          muted={introMuted}
        />

        {/* Play button over last frame */}
        {phase === "ready" && (
          <div className="center lower">
            <button className="play-btn" onClick={rollPercentage}>▶ PLAY</button>
          </div>
        )}

        {/* Rolling / result */}
        {(phase === "rolling" || phase === "result") && (
          <div className="center">
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
          </div>
        )}

        {/* WA video */}
        <video
          ref={waVideoRef}
          className={`absolute inset-0 w-full h-full object-cover ${phase === "playing" ? "" : "hidden"}`}
          onEnded={handleWaEnded}
          playsInline
        />

      </div>
    </>
  )
}
