import { db } from '@/lib/db';
import { technicians, clients } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck, Award, School, Trash2, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { addTechnician } from '../actions';
import { EditTechnicianDialog } from '@/components/EditTechnicianDialog';

export default async function TechniciansPage() {
    const techniciansList = await db.select({
        id: technicians.id,
        name: technicians.name,
        email: technicians.email,
        status: technicians.status,
        certifications: technicians.certifications,
        dealerId: technicians.dealerId,
        dealerName: clients.name,
        dealerLocation: clients.location,
    })
        .from(technicians)
        .leftJoin(clients, eq(technicians.dealerId, clients.id));

    const dealerList = await db.select().from(clients).where(eq(clients.type, 'Dealer'));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-nautical-primary">Técnicos y Certificaciones</h2>
                    <p className="text-gray-500">Gestión de personal técnico y cualificaciones de la red.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-nautical-secondary hover:bg-nautical-primary text-white">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Técnico
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                                <DialogTitle>Añadir Técnico</DialogTitle>
                                <DialogDescription>
                                    Registrar un nuevo técnico en la red de concesionarios.
                                </DialogDescription>
                            </DialogHeader>
                            <form action={addTechnician} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Nombre</Label>
                                    <Input id="name" name="name" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dealerId" className="text-right">Dealer</Label>
                                    <div className="col-span-3">
                                        <select name="dealerId" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
                                            <option value="" disabled selected>Seleccionar Concesionario</option>
                                            {dealerList.map(dealer => (
                                                <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="certifications" className="text-right text-xs">Certificados</Label>
                                    <Input id="certifications" name="certifications" className="col-span-3" placeholder="Ej. Master, Verado (separado por comas)" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full">Guardar Técnico</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Técnicos Certificados</CardTitle>
                        <UserCheck className="h-4 w-4 text-nautical-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-nautical-primary">{techniciansList.length}</div>
                        <p className="text-xs text-gray-500">En {dealerList.length} concesionarios activos</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Master Technicians</CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        {/* @ts-ignore */}
                        <div className="text-2xl font-bold text-nautical-primary">
                            {techniciansList.filter(t => t.certifications?.includes('Master')).length}
                        </div>
                        <p className="text-xs text-gray-500">Nivel experto</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Pendientes</CardTitle>
                        <School className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-nautical-primary">12</div>
                        <p className="text-xs text-gray-500">Próxima convocatoria: Noviembre</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {techniciansList.map((tech) => {
                    const certs = tech.certifications ? JSON.parse(tech.certifications) : [];
                    return (
                        <Card key={tech.id} className="overflow-hidden hover:shadow-lg transition-all border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-4 bg-slate-50/80 pb-4 relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-200">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tech.name}`} />
                                    <AvatarFallback>{tech.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg text-nautical-primary truncate">{tech.name}</CardTitle>
                                    <div className="text-sm text-nautical-secondary opacity-70 truncate">{tech.dealerName}</div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <EditTechnicianDialog technician={tech} dealers={dealerList} />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="mb-4">
                                    <div className="text-[10px] font-bold mb-2 text-nautical-primary uppercase tracking-wider opacity-60">Certificaciones Qualificadas</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {certs.length > 0 ? (
                                            certs.map((cert: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-[10px] border-slate-200 text-slate-600 font-medium">
                                                    {cert}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">Sin cualificaciones registradas</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-slate-100">
                                    <span className={`flex items-center gap-1.5 font-medium ${tech.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${tech.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                        {tech.status === 'Active' ? 'ESTADO: ACTIVO' : 'ESTADO: INACTIVO'}
                                    </span>
                                    <div className="text-nautical-accent text-[10px] font-bold flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {tech.dealerLocation}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
