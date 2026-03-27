import { db } from '@/lib/db';
import { products, clients, settings } from '@/lib/schema';
import { sql, eq, count } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  Database,
  ShieldCheck,
  Globe,
  Settings,
  Package,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getStats() {
  const [productCount, clientCount] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(clients)
  ]);
  return { products: productCount[0].count, clients: clientCount[0].count };
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  if (!cookieStore.get('session')) {
    redirect('/products');
  }

  const stats = await getStats();

  const milestones = [
    {
      id: 1,
      title: "Unificación de Bases de Datos",
      desc: "Fusión de ecosistemas PIM y CRM en un único motor SQLite mediante Drizzle ORM.",
      icon: <Database className="h-5 w-5" />,
      tag: "Arquitectura"
    },
    {
      id: 2,
      title: "Integración de Catálogo PIM",
      desc: "Migración de la interfaz de productos Mercury, Quicksilver y Bayliner al núcleo del CRM.",
      icon: <Layers className="h-5 w-5" />,
      tag: "Frontend"
    },
    {
      id: 3,
      title: "Seguridad & Control de Acceso",
      desc: "Autenticación por cookies y protección de rutas mediante Middleware de Next.js.",
      icon: <ShieldCheck className="h-5 w-5" />,
      tag: "Backend"
    },
    {
      id: 4,
      title: "Motor de Moneda Dinámica",
      desc: "Inyección global de divisas (EUR/USD/GBP) configurable desde base de datos.",
      icon: <Globe className="h-5 w-5" />,
      tag: "Localización"
    },
    {
      id: 5,
      title: "Gestión Administrativa PIM",
      desc: "Sistema CRUD completo con soporte para imágenes y validación inteligente de stock.",
      icon: <Package className="h-5 w-5" />,
      tag: "Operaciones"
    },
    {
      id: 6,
      title: "Normalización de Inventario",
      desc: "Seeding de precios realistas y limpieza de inconsistencias en el catálogo unificado.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      tag: "Data Quality"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Mini Hero */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 pb-8 gap-6 pt-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 bg-nautical-accent rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Demo Funcional / Luis Conde</span>
          </div>
          <h1 className="text-4xl font-black text-nautical-primary tracking-tighter">ROADMAP TÉCNICO</h1>
          <p className="text-slate-500 font-medium mt-1">Evolución y módulos funcionales integrados para la Demo</p>
        </div>
        <div className="flex gap-4">
          <Link href="/products">
            <Button className="rounded-2xl bg-nautical-primary hover:bg-nautical-accent font-bold px-6">
              Abrir Catálogo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {milestones.map((m, index) => (
          <div key={m.id} className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-nautical-accent transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-2 pt-1 border-r border-slate-50 pr-6">
                <span className="text-[10px] font-black text-slate-300">0{m.id}</span>
                <div className="h-10 w-10 rounded-xl bg-slate-50 text-nautical-primary flex items-center justify-center group-hover:bg-nautical-accent group-hover:text-white transition-colors">
                  {m.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase text-nautical-accent py-0.5 px-2 bg-blue-50 rounded-full">{m.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-nautical-primary leading-tight">{m.title}</h3>
                <p className="text-sm text-slate-400 font-medium mt-2 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real Statistics Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <StatItem label="Productos PIM" value={stats.products} />
        <StatItem label="Clientes CRM" value={stats.clients} />
        <StatItem label="Tecnologías" value="Next.js, Drizzle" />
        <StatItem label="Stack DB" value="SQLite Unified" />
      </div>

      {/* Demo Actions Footer */}
      <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Cpu className="h-6 w-6 text-nautical-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-nautical-primary">Sistema Optimizado</p>
            <p className="text-xs text-slate-400 font-medium">Arquitectura Server-First lista para despliegue.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/settings">
            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold px-6">
              Configuración Global
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-50 flex flex-col items-center justify-center text-center">
      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-sm font-black text-nautical-primary">{value}</span>
    </div>
  );
}
