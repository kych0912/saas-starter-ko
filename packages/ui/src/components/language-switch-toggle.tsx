'use client'

import { Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitchToggle() {
    const params = useParams();
    const lng = params.lng as string;
    
    const currentPath = usePathname();
    const pathWithoutLng = currentPath.replace(`/${lng}`, '');
    const koreanPath = `/ko${pathWithoutLng}`;
    const englishPath = `/en${pathWithoutLng}`;

    return (
        <div className='flex items-center gap-2'>
            <Link 
                href={lng === 'en' ? englishPath : koreanPath}
                className='text-sm font-medium text-foreground hover:underline'
            >
                {
                    lng === 'en' ? 'en' : 'ko'
                }
            </Link>
            {
                '|'
            }
            <Link 
                href={lng === 'en' ? koreanPath : englishPath}
                className='text-sm font-medium text-muted-foreground hover:underline'
            >   
                {
                    lng === 'en' ? 'ko' : 'en'
                }
            </Link>
        </div>
    )
}