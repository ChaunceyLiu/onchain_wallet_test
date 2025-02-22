import { useEffect } from "react";
import styles from "./styles.module.css";

export default function AdaptiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const updateViewport = () => {
      document.documentElement.style.setProperty(
        "--dvh",
        `${window.visualViewport?.height || window.innerHeight}px`
      );
    };

    window.visualViewport?.addEventListener("resize", updateViewport);
    return () =>
      window.visualViewport?.removeEventListener("resize", updateViewport);
  }, []);

  return <div className={styles.container}>{children}</div>;
}
