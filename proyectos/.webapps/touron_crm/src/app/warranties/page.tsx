import { db } from '@/lib/db';
import { warranties, clients, products } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, XCircle, Search, Trash2, Edit } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { registerWarranty, deleteWarranty, updateWarranty } from '../actions';

export default async function WarrantiesPage() {
    const warrantyList = await db.select({
        id: warranties.id,
        serialNumber: warranties.serialNumber,
        customer: warranties.customerName,
        date: warranties.registrationDate,
        status: warranties.status,
        type: warranties.claimType,
        productName: products.name,
        dealerName: clients.name,
    })
        .from(warranties)
        .leftJoin(products, eq(warranties.productId, products.id))
        .leftJoin(clients, eq(warranties.dealerId, clients.id))
        .orderBy(desc(warranties.registrationDate));

    const dealerList = await db.select().from(clients).where(eq(clients.type, 'Dealer'));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-nautical-primary">Gestión de Garantías</h2>
                    <p className="text-gray-500">Registro de motores y gestión de reclamaciones Mercury/Quicksilver.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-nautical-primary hover:bg-nautical-secondary text-white">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Registro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Registrar Garantía</DialogTitle>
                                <DialogDescription>
                                    Alta de motor o embarcación para cobertura de garantía.
                                </DialogDescription>
                            </DialogHeader>
                            <form action={registerWarranty} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="serialNumber" className="text-right">Nº Serie</Label>
                                    <Input id="serialNumber" name="serialNumber" className="col-span-3" placeholder="Ej. 1B..." required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="customerName" className="text-right">Cliente</Label>
                                    <Input id="customerName" name="customerName" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dealerId" className="text-right">Dealer</Label>
                                    <div className="col-span-3">
                                        <select name="dealerId" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                            {dealerList.map(dealer => (
                                                <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="notes" className="text-right">Notas</Label>
                                    <Input id="notes" name="notes" className="col-span-3" />
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Registrar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Garantías Activas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{warrantyList.filter(w => w.status === 'Approved').length}</div>
                        <p className="text-xs text-gray-500">+12% respecto al mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reclamaciones Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{warrantyList.filter(w => w.status === 'Pending').length}</div>
                        <p className="text-xs text-gray-500">Tiempo medio de respuesta: 2 días</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{warrantyList.filter(w => w.status === 'Rejected').length}</div>
                        <p className="text-xs text-gray-500">1.5% del total</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-white">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input placeholder="Buscar por serie o cliente..." className="pl-8" />
                    </div>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Serie</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Producto</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Cliente / Concesionario</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tipo</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {warrantyList.map((warranty) => (
                                <tr key={warranty.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 font-mono">{warranty.serialNumber}</td>
                                    <td className="p-4">{warranty.productName || 'Producto Desconocido'}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{warranty.customer}</div>
                                        <div className="text-xs text-gray-500">{warranty.dealerName}</div>
                                    </td>
                                    <td className="p-4">{new Date(warranty.date).toLocaleDateString('es-ES')}</td>
                                    <td className="p-4">
                                        <Badge variant="outline">{warranty.type === 'Registration' ? 'Registro' : 'Reclamación'}</Badge>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={warranty.status} />
                                    </td>
                                    <td className="p-4 text-right flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] bg-white">
                                                <DialogHeader>
                                                    <DialogTitle>Editar Garantía</DialogTitle>
                                                    <DialogDescription>
                                                        Modificar estado y tipo de reclamación.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form action={updateWarranty} className="grid gap-4 py-4">
                                                    <input type="hidden" name="id" value={warranty.id} />
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="status" className="text-right">Estado</Label>
                                                        <div className="col-span-3">
                                                            <div className="relative">
                                                                <select name="status" defaultValue={warranty.status || 'Pending'} className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                                                    <option value="Pending">Pendiente</option>
                                                                    <option value="Approved">Aprobada</option>
                                                                    <option value="Rejected">Rechazada</option>
                                                                    <option value="InfoRequired">Info Requerida</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="type" className="text-right">Tipo</Label>
                                                        <div className="col-span-3">
                                                            <div className="relative">
                                                                <select name="type" defaultValue={warranty.type || 'Registration'} className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                                                    <option value="Registration">Registro</option>
                                                                    <option value="Claim">Reclamación</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit">Guardar Cambios</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        <form action={deleteWarranty}>
                                            <input type="hidden" name="id" value={warranty.id} />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string | null }) {
    let colorClass = "bg-gray-100 text-gray-800";
    let label = status;

    switch (status) {
        case 'Approved':
            colorClass = "bg-green-100 text-green-800 border-green-200";
            label = "Aprobada";
            break;
        case 'Pending':
            colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            label = "Pendiente";
            break;
        case 'Rejected':
            colorClass = "bg-red-100 text-red-800 border-red-200";
            label = "Rechazada";
            break;
    }

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${colorClass}`}>
            {label}
        </span>
    );
}
