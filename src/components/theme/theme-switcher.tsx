'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Check, Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const themes = [
    { name: 'Kyoto Garden - Light', value: 'kyoto-garden-light' },
    { name: 'Kyoto Garden - Dark', value: 'kyoto-garden-dark' },
    { name: 'Twilight Gradient - Light', value: 'twilight-gradient-light' },
    { name: 'Twilight Gradient - Dark', value: 'twilight-gradient-dark' },
    { name: 'Fresh Mint - Light', value: 'fresh-mint-light' },
    { name: 'Fresh Mint - Dark', value: 'fresh-mint-dark' },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start gap-2 group-data-[collapsible=expanded]:w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-2">
                                <Palette />
                                <span className="group-data-[collapsible=icon]:hidden">Switch Theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        <p>Switch Theme</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map((t) => (
                     <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
                        <div className="flex items-center justify-between w-full">
                            <span>{t.name}</span>
                            {theme === t.value && <Check className="h-4 w-4" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
