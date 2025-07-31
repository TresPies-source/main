'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const themes = [
    { name: 'Kyoto Garden', value: 'theme-kyoto-garden' },
    { name: 'Twilight Gradient', value: 'theme-twilight-gradient' },
    { name: 'Fresh Mint', value: 'theme-fresh-mint' },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const currentThemeName = themes.find(t => t.value === theme)?.name || 'Kyoto Garden';

    return (
        <div>
            <h3 className="text-sm font-medium mb-2">Color Theme</h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        <span>{currentThemeName}</span>
                        <Palette className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
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
        </div>
    );
}
