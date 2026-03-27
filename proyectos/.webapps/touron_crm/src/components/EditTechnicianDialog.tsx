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
import { updateTechnician, deleteTechnician } from '@/app/actions';

interface Dealer {
    id: number;
    name: string;
}

interface Technician {
    id: number;
    name: string;
    status: string | null;
    certifications: string | null;
    dealerId: number | null;
}

export function EditTechnicianDialog({
    technician,
    dealers
}: {
    technician: Technician;
    dealers: Dealer[]
}) {
    const [open, setOpen] = useState(false);

    // Parse current certifications
    const certsStr = technician.certifications
        ? JSON.parse(technician.certifications).join(', ')
        : '';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-nautical-primary">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-nautical-primary">
                <DialogHeader>
                    <DialogTitle>Editar Técnico</DialogTitle>
                    <DialogDescription>
                        Modifica los datos del personal técnico y sus certificaciones.
                    </DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    await updateTechnician(formData);
                    setOpen(false);
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="id" value={technician.id} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-tech-name" className="text-right">Nombre</Label>
                        <Input id="edit-tech-name" name="name" defaultValue={technician.name} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-tech-dealer" className="text-right">Dealer</Label>
                        <div className="col-span-3">
                            <select
                                name="dealerId"
                                defaultValue={technician.dealerId || ''}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                required
                            >
                                <option value="" disabled>Seleccionar Dealer</option>
                                {dealers.map(dealer => (
                                    <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-tech-status" className="text-right">Estado</Label>
                        <div className="col-span-3">
                            <select
                                name="status"
                                defaultValue={technician.status || 'Active'}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="Active">Activo</option>
                                <option value="Inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-tech-certs" className="text-right text-xs">Certificados</Label>
                        <Input
                            id="edit-tech-certs"
                            name="certifications"
                            defaultValue={certsStr}
                            className="col-span-3"
                            placeholder="Ej. Master, Verado (separado por comas)"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar este técnico?')) {
                                    const formData = new FormData();
                                    formData.append('id', technician.id.toString());
                                    await deleteTechnician(formData);
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
