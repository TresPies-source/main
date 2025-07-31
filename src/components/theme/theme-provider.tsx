"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const THEMES = [
    'kyoto-garden-light',
    'kyoto-garden-dark',
    'twilight-gradient-light',
    'twilight-gradient-dark',
    'fresh-mint-light',
    'fresh-mint-dark',
];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} themes={THEMES}>{children}</NextThemesProvider>
}

export function useTheme() {
    const context = useNextTheme();
    const [themeName, themeMode] = context.theme?.split('-') ?? ['kyoto-garden', 'light'];

    const setThemeByName = (name: string) => {
        // preserve the current mode (light/dark) when switching themes
        const newTheme = `${name}-${themeMode}`;
        if(THEMES.includes(newTheme)) {
            context.setTheme(newTheme);
        }
    }
    
    return {
        ...context,
        themeName,
        themeMode,
        setThemeByName
    }
}
