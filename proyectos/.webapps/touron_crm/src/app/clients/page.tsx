import { db } from '@/lib/db';
import { clients } from '@/lib/schema';
import { or, like } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Plus, Trash2, UsersIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addClient } from '../actions';
import { EditClientDialog } from '@/components/EditClientDialog';
import { ProductSearch } from '@/components/products/ProductSearch';

export default async function ClientsPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

    const conditions = [];
    if (q) {
        conditions.push(or(
            like(clients.name, `%${q}%`),
            like(clients.email, `%${q}%`),
            like(clients.location, `%${q}%`)
        ));
    }

    const allClients = await db.select().from(clients).where(q ? conditions[0] : undefined);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-nautical-primary p-3 rounded-2xl shadow-lg shadow-nautical-primary/10">
                        <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-nautical-primary uppercase">Concesionarios</h2>
                        <p className="text-slate-500 font-medium">Red de distribución y servicios oficiales de Touron.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-full md:w-80">
                        <ProductSearch placeholder="Buscar por nombre, ciudad o email..." />
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-nautical-accent hover:bg-nautical-accent/90 text-white font-black uppercase tracking-widest px-6 h-10 rounded-full shadow-lg shadow-nautical-accent/20 border-none transition-all active:scale-95">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                                <DialogDescription>
                                    Registra un nuevo concesionario o servicio oficial.
                                </DialogDescription>
                            </DialogHeader>
                            <form action={addClient} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Nombre</Label>
                                    <Input id="name" name="name" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Tipo</Label>
                                    <div className="col-span-3">
                                        <select name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="Dealer">Dealer</option>
                                            <option value="Service">Service</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input id="email" name="email" type="email" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">Teléfono</Label>
                                    <Input id="phone" name="phone" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="location" className="text-right">Ciudad</Label>
                                    <Input id="location" name="location" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="region" className="text-right">Región</Label>
                                    <Input id="region" name="region" className="col-span-3" placeholder="Ej. Iberia, Canarias..." />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Guardar Cliente</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allClients.map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow group relative overflow-hidden">
                        <CardHeader className="flex flex-row items-baseline justify-between space-y-0 pb-2">
                            <div className="flex-1 truncate pr-2">
                                <CardTitle className="text-lg font-bold text-nautical-primary truncate">
                                    {client.name}
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={client.type === 'Dealer' ? 'default' : 'secondary'}>
                                    {client.type}
                                </Badge>
                                <EditClientDialog client={client} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <MapPin className="mr-2 h-4 w-4 text-nautical-accent" />
                                    {client.location}
                                </div>
                                {client.phone && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Phone className="mr-2 h-4 w-4 text-nautical-accent" />
                                        {client.phone}
                                    </div>
                                )}
                                {client.email && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Mail className="mr-2 h-4 w-4 text-nautical-accent" />
                                        {client.email}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
