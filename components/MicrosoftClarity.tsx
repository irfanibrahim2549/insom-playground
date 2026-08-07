"use client";

import React, { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "xyfili7275";

export const MicrosoftClarity: React.FC = () => {
  useEffect(() => {
    if (CLARITY_PROJECT_ID) {
      try {
        Clarity.init(CLARITY_PROJECT_ID);
      } catch (err) {
        console.warn("Microsoft Clarity initialization error:", err);
      }
    }
  }, []);

  return null;
};
