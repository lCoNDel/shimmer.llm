'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClient, deleteClient } from '@/app/actions';

interface Client {
    id: number;
    name: string;
    type: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    region: string | null;
}

export function EditClientDialog({ client }: { client: Client }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-nautical-primary">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Concesionario</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del concesionario o servicio oficial.
                    </DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    await updateClient(formData);
                    setOpen(false);
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="id" value={client.id} />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right">Nombre</Label>
                        <Input id="edit-name" name="name" defaultValue={client.name} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-type" className="text-right">Tipo</Label>
                        <div className="col-span-3">
                            <select name="type" defaultValue={client.type || 'Dealer'} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="Dealer">Dealer</option>
                                <option value="Service">Service</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-email" className="text-right">Email</Label>
                        <Input id="edit-email" name="email" type="email" defaultValue={client.email} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-phone" className="text-right">Teléfono</Label>
                        <Input id="edit-phone" name="phone" defaultValue={client.phone || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-location" className="text-right">Ciudad</Label>
                        <Input id="edit-location" name="location" defaultValue={client.location || ''} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-region" className="text-right">Región</Label>
                        <Input id="edit-region" name="region" defaultValue={client.region || ''} className="col-span-3" />
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
                                    const formData = new FormData();
                                    formData.append('id', client.id.toString());
                                    await deleteClient(formData);
                                    setOpen(false);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                        <DialogFooter>
                            <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
