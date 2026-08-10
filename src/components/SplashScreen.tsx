import { motion, useAnimation, type Easing, type Variants } from "motion/react";
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
  logoSizeType?: "auto" | "fixed" | "percentage";
  logoWidth?: number;
  logoHeight?: number;
  duration?: number;
  fadeOutDuration?: number;
  autoHide?: boolean;
  logoEasing?: keyof typeof easingFunctions;
  curtainEasing?: keyof typeof easingFunctions;
  onComplete?: () => void;
  children?: React.ReactNode;
  text?: string;
  textColor?: string;
  textSize?: number;
  textDuration?: number;
}

function computeLogoSize(
  viewportWidth: number,
  viewportHeight: number,
  logoSizeType: "auto" | "fixed" | "percentage",
  logoWidth: number,
  logoHeight: number,
): { width: number; height: number } {
  if (logoSizeType === "auto") {
    const minDimension = Math.min(viewportWidth, viewportHeight);
    const baseSize = Math.max(150, Math.min(500, minDimension * 0.4));
    return { width: baseSize, height: baseSize };
  }
  if (logoSizeType === "percentage") {
    return {
      width: (viewportWidth * logoWidth) / 100,
      height: (viewportHeight * logoHeight) / 100,
    };
  }
  return { width: logoWidth, height: logoHeight };
}

export default function SplashScreen({
  logo = {
    src: "/Logo.avif",
    alt: "Logo",
  },
  backgroundColor = "#000000",
  logoSizeType = "auto",
  logoWidth = 150,
  logoHeight = 150,
  duration = 1.2,
  fadeOutDuration = 0.8,
  autoHide = true,
  logoEasing = "elegantEntry",
  curtainEasing = "elegantExit",
  onComplete,
  children,
  text,
  textColor = "#ffffff",
  textSize = 18,
  textDuration = 0.6,
}: SplashScreenProps) {
  // Check sessionStorage langsung saat inisialisasi state awal
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("splashScreenSeen");
  });

  const [isMounted, setIsMounted] = useState(false);
  const contentWrapperControls = useAnimation();
  const curtainControls = useAnimation();
  const isMountedRef = useRef(true);

  // Set flag mount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Hitung Logo Size
  const [logoSize, setLogoSize] = useState(() => {
    if (typeof window === "undefined") return { width: 300, height: 300 };
    return computeLogoSize(
      window.innerWidth,
      window.innerHeight,
      logoSizeType,
      logoWidth,
      logoHeight,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLogoSize = () => {
      setLogoSize(
        computeLogoSize(
          window.innerWidth,
          window.innerHeight,
          logoSizeType,
          logoWidth,
          logoHeight,
        ),
      );
    };

    window.addEventListener("resize", updateLogoSize);
    return () => window.removeEventListener("resize", updateLogoSize);
  }, [logoSizeType, logoWidth, logoHeight]);

  const curtainEase: Easing = [
    ...(easingFunctions[curtainEasing] || easingFunctions.elegantExit),
  ];
  const logoEase: Easing = [
    ...(easingFunctions[logoEasing] || easingFunctions.elegantEntry),
  ];

  // Logika Animasi Keluar (Satu useEffect saja)
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

        // Jalankan animasi transisi keluar
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

        // Simpan flag di SessionStorage dan hilangkan splash
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

  // Variants
  const logoVariants: Variants = {
    hidden: { y: 60, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration, ease: logoEase },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: textDuration,
        ease: "easeOut",
        delay: duration,
      },
    },
  };

  // Jangan render splash jika sudah pernah dilihat atau belum mounted di client
  if (!isMounted || !shouldShow) {
    return <>{children}</>;
  }

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
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${logoSize.width}px`,
              height: `${logoSize.height}px`,
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
          </motion.div>

          {/* Text */}
          {text && (
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
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
            </motion.p>
          )}
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}
