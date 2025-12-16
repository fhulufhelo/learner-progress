import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const isItemActive = (item: NavItem) => {
        const itemUrl = resolveUrl(item.href);
        const currentUrl = page.url;

        if (itemUrl === '/') {
            return currentUrl === '/' || currentUrl === '';
        }
        return currentUrl === itemUrl || currentUrl.startsWith(itemUrl + '/');
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isItemActive(item);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={
                                    isActive
                                        ? 'bg-[#c69930] text-white hover:bg-[#c69930] hover:text-white data-[state=open]:bg-[#c69930] data-[state=open]:text-white'
                                        : 'hover:bg-[#3a3a3a] hover:text-[#e5e5e5]'
                                }
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}