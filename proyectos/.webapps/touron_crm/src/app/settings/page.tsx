import { db } from '@/lib/db';
import { settings } from '@/lib/schema';
import { updateSettings } from '@/app/actions';
import { Save, Shield, Settings, Globe, Mail, DollarSign } from 'lucide-react';

export default async function SettingsPage() {
    const allSettings = await db.select().from(settings);

    // Map settings to a more usable object
    const config = allSettings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-nautical-accent/10 p-2.5 rounded-2xl">
                        <Settings className="h-6 w-6 text-nautical-accent" />
                    </div>
                    <h1 className="text-4xl font-black text-nautical-primary tracking-tighter uppercase">Configuración</h1>
                </div>
                <p className="text-slate-400 font-medium ml-12">Administra los parámetros globales y preferencias de la plataforma Touron CRM.</p>
            </header>

            <form action={updateSettings} className="space-y-8">
                {/* General Section */}
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-nautical-accent" />
                            <h3 className="font-black text-nautical-primary uppercase tracking-widest text-xs">General & Identidad</h3>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Sistema</label>
                            <input
                                type="text"
                                name="system_name"
                                defaultValue={config.system_name || 'Touron CRM'}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all font-bold text-nautical-primary"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de Contacto</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    name="contact_email"
                                    defaultValue={config.contact_email || 'admin@touron.es'}
                                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all font-bold text-nautical-primary"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Localization Section */}
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-nautical-accent" />
                            <h3 className="font-black text-nautical-primary uppercase tracking-widest text-xs">Localización & Moneda</h3>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Moneda Principal</label>
                            <select
                                name="currency"
                                defaultValue={config.currency || 'EUR'}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all font-bold text-nautical-primary appearance-none"
                            >
                                <option value="EUR">Euro (€)</option>
                                <option value="USD">Dólar ($)</option>
                                <option value="GBP">Libra (£)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Maintenance Section */}
                <section className="bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="bg-red-500/20 p-4 rounded-2xl">
                            <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Modo Mantenimiento</h3>
                            <p className="text-white/40 text-xs font-medium">Bloquea el acceso público a la plataforma para realizar tareas técnicas.</p>
                        </div>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="maintenance_mode"
                            value="true"
                            defaultChecked={config.maintenance_mode === 'true'}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-nautical-accent"></div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-nautical-primary hover:bg-nautical-accent text-white font-black uppercase tracking-[0.2em] py-5 px-12 rounded-2xl transition-all shadow-xl shadow-nautical-primary/10 hover:shadow-nautical-accent/20 flex items-center gap-3 active:scale-[0.98]"
                    >
                        <Save className="h-5 w-5" />
                        Guardar Configuración
                    </button>
                </div>
            </form>
        </div>
    );
}

