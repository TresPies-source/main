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

    return (
        <div>
            <h3 className="text-sm font-medium mb-2">Color Theme</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themes.map((t) => {
                    const isActive = (theme === 'system' && t.value === 'theme-kyoto-garden') || theme === t.value;
                    return (
                        <Button
                            key={t.value}
                            variant="outline"
                            className={cn(
                                "justify-start h-12",
                                isActive && "border-primary border-2"
                            )}
                            onClick={() => setTheme(t.value)}
                        >
                            {isActive && <Check className="mr-2 h-4 w-4" />}
                            {t.name}
                        </Button>
                    )
                })}
            </div>
        </div>
    );
}
