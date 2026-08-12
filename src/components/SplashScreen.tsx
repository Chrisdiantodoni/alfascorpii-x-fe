import { motion, useAnimation, type Easing } from "motion/react";
import { useEffect, useState, useRef } from "react";

const easingFunctions = {
  elegantEntry: [0.22, 1, 0.36, 1],
  elegantExit: [0.64, 0, 0.78, 0],
  smooth: [0.4, 0, 0.2, 1],
  snappy: [0.8, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
} as const;

interface SplashScreenProps {
  logo?: {
    src: string;
    alt: string;
  };
  backgroundColor?: string;
  duration?: number;
  fadeOutDuration?: number;
  autoHide?: boolean;
  curtainEasing?: keyof typeof easingFunctions;
  onComplete?: () => void;
  children?: React.ReactNode;
  text?: string;
  textColor?: string;
  textSize?: number;
  textDuration?: number;
}

export default function SplashScreen({
  logo = {
    src: "/Logo.avif",
    alt: "Logo",
  },
  backgroundColor = "#000000",
  duration = 0.6,
  fadeOutDuration = 0.5,
  autoHide = true,
  curtainEasing = "elegantExit",
  onComplete,
  children,
  text,
  textColor = "#ffffff",
  textSize = 18,
  textDuration = 0.4,
}: SplashScreenProps) {
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("splashScreenSeen");
  });

  const [isMounted, setIsMounted] = useState(false);
  const contentWrapperControls = useAnimation();
  const curtainControls = useAnimation();
  const isMountedRef = useRef(true);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const curtainEase: Easing = [
    ...(easingFunctions[curtainEasing] || easingFunctions.elegantExit),
  ];

  useEffect(() => {
    if (!autoHide || !isMounted || !shouldShow) return;

    isMountedRef.current = true;
    let timeoutId: number | null = null;
    const entranceTime = duration + (text ? textDuration : 0);

    const runExit = async () => {
      try {
        await new Promise((resolve) => {
          timeoutId = window.setTimeout(resolve, (entranceTime + 0.6) * 1000);
        });

        if (!isMountedRef.current) return;

        await Promise.all([
          contentWrapperControls.start({
            opacity: 0,
            y: -40,
            transition: {
              duration: fadeOutDuration * 0.7,
              ease: curtainEase,
            },
          }),
          curtainControls.start({
            y: "-100%",
            transition: {
              duration: fadeOutDuration,
              ease: curtainEase,
            },
          }),
        ]);

        if (!isMountedRef.current) return;

        sessionStorage.setItem("splashScreenSeen", "true");
        setShouldShow(false);
        onComplete?.();
      } catch (error) {
        // Animation cancelled / unmounted
      }
    };

    runExit();

    return () => {
      isMountedRef.current = false;
      if (timeoutId !== null) clearTimeout(timeoutId);
      contentWrapperControls.stop();
      curtainControls.stop();
    };
  }, [
    autoHide,
    isMounted,
    shouldShow,
    duration,
    textDuration,
    fadeOutDuration,
    text,
  ]);

  if (typeof window !== "undefined" && !shouldShow) {
    return <>{children}</>;
  }

  // SSR + first client paint: static splash (no Framer Motion) — covers content
  if (!isMounted) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "clamp(120px, 30vw, 280px)",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            {text && (
              <p
                style={{
                  margin: 0,
                  marginTop: "24px",
                  color: textColor,
                  fontSize: `${textSize}px`,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textAlign: "center",
                }}
              >
                {text}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Client mounted: animated exit only — logo langsung visible, no entrance animation
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div
        animate={curtainControls}
        initial={{ y: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={contentWrapperControls}
          initial={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "clamp(120px, 30vw, 280px)",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {text && (
            <p
              style={{
                margin: 0,
                marginTop: "24px",
                color: textColor,
                fontSize: `${textSize}px`,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              {text}
            </p>
          )}
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}
