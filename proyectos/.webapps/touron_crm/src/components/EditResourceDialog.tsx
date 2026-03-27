'use client';

import { useState } from 'react';
import { Pencil, Trash2, FileDown } from "lucide-react";
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
import { updateResource, deleteResource } from '@/app/actions';

interface Resource {
    id: number;
    title: string;
    type: string;
    category: string | null;
    url: string;
}

export function EditResourceDialog({ resource }: { resource: Resource }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-nautical-primary bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-nautical-primary">
                <DialogHeader>
                    <DialogTitle>Editar Recurso Técnico</DialogTitle>
                    <DialogDescription>
                        Actualiza la documentación técnica, manuales o diagramas.
                    </DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    await updateResource(formData);
                    setOpen(false);
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="id" value={resource.id} />

                    <div className="grid gap-2">
                        <Label htmlFor="edit-res-title">Título del Documento</Label>
                        <Input id="edit-res-title" name="title" defaultValue={resource.title} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-res-type">Tipo</Label>
                            <select
                                name="type"
                                defaultValue={resource.type}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Diagram">Diagrama</option>
                                <option value="Software">Software</option>
                                <option value="Bulletin">Boletín</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-res-cat">Categoría</Label>
                            <Input id="edit-res-cat" name="category" defaultValue={resource.category || ''} placeholder="Ej: Outboard" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-res-file">Reemplazar Archivo (Opcional)</Label>
                        <div className="flex flex-col gap-1">
                            <Input id="edit-res-file" name="url" type="file" />
                            <p className="text-[10px] text-gray-500 italic flex items-center gap-1">
                                <FileDown className="h-3 w-3" />
                                Archivo actual: {resource.url.split('/').pop()}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
                                    const formData = new FormData();
                                    formData.append('id', resource.id.toString());
                                    await deleteResource(formData);
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
