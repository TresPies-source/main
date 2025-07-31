'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { Check, Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const themes = [
    { name: 'Kyoto Garden', value: 'kyoto-garden' },
    { name: 'Twilight Gradient', value: 'twilight-gradient' },
    { name: 'Fresh Mint', value: 'fresh-mint' },
];

export function ThemeSwitcher() {
    const { themeName, setThemeByName } = useTheme();

    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="group-data-[collapsible=icon]:w-full">
                                <Palette />
                                <span className="sr-only">Switch Theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        <p>Switch Theme</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
                {themes.map((t) => (
                     <DropdownMenuItem key={t.value} onClick={() => setThemeByName(t.value)}>
                        <div className="flex items-center justify-between w-full">
                            <span>{t.name}</span>
                            {themeName === t.value && <Check className="h-4 w-4" />}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
