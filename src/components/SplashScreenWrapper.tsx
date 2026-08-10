import SplashScreen from "./SplashScreen";

interface SplashScreenWrapperProps {
  children: React.ReactNode;
  showSplash?: boolean;
}

export default function SplashScreenWrapper({
  children,
  showSplash = true,
}: SplashScreenWrapperProps) {
  if (!showSplash) {
    return <>{children}</>;
  }

  return <SplashScreen text="Alfa Scorpii X">{children}</SplashScreen>;
}
