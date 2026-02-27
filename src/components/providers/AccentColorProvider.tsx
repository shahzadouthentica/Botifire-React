import React, { createContext, useContext, useEffect, useState } from "react";

type AccentColor = {
  name: string;
  hsl: string;
  hex?: string;
};

// Helper to convert hex to HSL string (h s% l%)
const hexToHsl = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const colors: AccentColor[] = [
  { name: "Default", hsl: "160 81% 43%", hex: "#1fb881" },
  { name: "Blue", hsl: "221 83% 53%", hex: "#1e6ef9" },
  { name: "Purple", hsl: "271 91% 65%", hex: "#a855f7" },
  { name: "Rose", hsl: "346 84% 61%", hex: "#f43f5e" },
  { name: "Orange", hsl: "24 95% 53%", hex: "#f97316" },
];

interface AccentColorContextType {
  accentColor: AccentColor;
  setCustomColor: (hex: string) => void;
  setPresetColor: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(undefined);

export const AccentColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem("botifire-accent-color");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return colors[0];
      }
    }
    return colors[0];
  });

  const setCustomColor = (hex: string) => {
    const color = { name: "Custom", hsl: hexToHsl(hex), hex };
    setAccentColorState(color);
    localStorage.setItem("botifire-accent-color", JSON.stringify(color));
  };

  const setPresetColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem("botifire-accent-color", JSON.stringify(color));
  };

  useEffect(() => {
    const styleId = "botifire-dynamic-accent";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      :root, .light, .dark, [data-theme], [class*="theme-"] {
        --accent: ${accentColor.hsl} !important;
        --ring: ${accentColor.hsl} !important;
        --sidebar-ring: ${accentColor.hsl} !important;
      }
    `;
  }, [accentColor]);

  return (
    <AccentColorContext.Provider value={{ accentColor, setCustomColor, setPresetColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};


export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (context === undefined) {
    throw new Error("useAccentColor must be used within an AccentColorProvider");
  }
  return context;
};
