import Link from 'next/link';
import { Home, Package, Users, ShoppingCart, Settings, Anchor, Wrench, Megaphone, BookOpen, LogOut } from 'lucide-react';
import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { logout } from '@/app/actions';
import { cookies } from 'next/headers';

const navItems = [
    { name: 'Panel de Control', href: '/', icon: Home },
    { name: 'PIM', href: '/products', icon: Package },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
    { name: 'Garantías', href: '/warranties', icon: Anchor },
    { name: 'Técnicos', href: '/technicians', icon: Wrench },
    { name: 'Campañas', href: '/campaigns', icon: Megaphone },
    { name: 'Recursos', href: '/resources', icon: BookOpen },
    { name: 'Configuración', href: '/settings', icon: Settings },
];

export async function Sidebar() {
    const systemNameSetting = await db.select().from(settings).where(eq(settings.key, 'system_name')).get();
    const contactEmailSetting = await db.select().from(settings).where(eq(settings.key, 'contact_email')).get();

    const systemName = systemNameSetting?.value || 'Touron';
    const contactEmail = contactEmailSetting?.value || 'admin@touron.es';

    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value || 'Administrador';


    return (
        <aside className="w-64 bg-nautical-primary text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl border-r border-nautical-secondary/50 z-50">
            <div className="p-6 flex items-center space-x-3 border-b border-white/5">
                <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30 bg-white/5 p-1 border border-white/10">
                    <img src="/tou-logo.jpg" alt="Touron Logo" className="h-14 w-14 object-contain" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter uppercase leading-none">{systemName}</h1>
                    <span className="text-[10px] font-bold text-nautical-accent uppercase tracking-widest leading-none">Admin Panel</span>
                </div>
            </div>
            <nav className="flex-1 py-6">
                <ul className="space-y-1.5 px-3">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                            >
                                <item.icon className="h-5 w-5 group-hover:text-nautical-accent transition-colors" />
                                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="h-8 w-8 rounded-xl bg-nautical-accent flex items-center justify-center text-[10px] font-black text-nautical-primary shadow-lg shadow-nautical-accent/10 uppercase">
                        {username.substring(0, 3)}
                    </div>
                    <div className="text-sm">
                        <p className="font-black text-white/90 text-xs uppercase tracking-widest">{username}</p>
                        <p className="text-white/40 text-[10px] font-medium">{contactEmail}</p>
                    </div>
                </div>
                <form action={logout}>
                    <button type="submit" className="p-2 text-white/40 hover:text-red-400 transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </aside>
    );
}
