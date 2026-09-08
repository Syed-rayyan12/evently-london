"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./site-loader.module.css";

export function SiteLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let didFinish = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (didFinish) {
        return;
      }

      didFinish = true;
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, 1200 - elapsed);

      hideTimer = setTimeout(() => {
        setIsLeaving(true);
        removeTimer = setTimeout(() => setIsVisible(false), 520);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const fallbackTimer = setTimeout(finish, 2600);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(fallbackTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles.loader} ${isLeaving ? styles.loaderLeaving : ""}`}
      aria-busy="true"
      aria-label="Loading Evently"
      role="status"
    >
      <div className={styles.loaderBackdrop} />
      <div className={styles.loaderContent}>
        <div className={styles.loaderMark}>
          <span className={styles.loaderRing} />
          <span className={styles.loaderRingInner} />
          <Image
            src="/images/site-logo.png"
            alt="Evently"
            width={152}
            height={104}
            priority
            className={styles.loaderLogo}
          />
        </div>

        <p className={styles.loaderEyebrow}>Curating your event experience</p>
        <div className={styles.loaderTrack} aria-hidden="true">
          <span className={styles.loaderProgress} />
        </div>
      </div>
    </div>
  );
}
