"use client";

import React, { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export const MicrosoftClarity: React.FC = () => {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId) {
      try {
        Clarity.init(projectId);
      } catch (err) {
        console.warn("Microsoft Clarity initialization error:", err);
      }
    }
  }, []);

  return null;
};
