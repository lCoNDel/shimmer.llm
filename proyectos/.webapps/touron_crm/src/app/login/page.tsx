import { login } from '@/app/actions';
import { Anchor, Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-nautical-primary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 opacity-5 -mr-40 -mt-40">
                <Anchor className="h-[600px] w-[600px] text-white rotate-12" />
            </div>

            <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/50">
                    <div className="bg-nautical-accent p-10 flex flex-col items-center text-nautical-primary">
                        <div className="bg-white/20 p-4 rounded-3xl mb-4 backdrop-blur-sm">
                            <ShieldCheck className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Acceso Admin</h1>
                        <p className="text-nautical-primary/60 text-xs font-bold uppercase tracking-widest">Touron Ecosystem CRM</p>
                    </div>

                    <form action={login} className="p-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all font-bold text-nautical-primary"
                                    placeholder="Nombre de usuario"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-nautical-accent focus:ring-4 focus:ring-nautical-accent/5 outline-none transition-all font-bold text-nautical-primary"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-nautical-primary hover:bg-nautical-accent text-white font-black uppercase tracking-[0.2em] py-8 rounded-2xl transition-all shadow-xl shadow-nautical-primary/20 hover:shadow-nautical-accent/30 border-none mt-4 text-sm"
                        >
                            Entrar al Sistema
                        </Button>

                    </form>
                </div>

                <p className="text-center mt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    © 2026 Luis Conde Blanco - Licencia CC BY-NC 4.0
                </p>
            </div>
        </div>
    );
}
