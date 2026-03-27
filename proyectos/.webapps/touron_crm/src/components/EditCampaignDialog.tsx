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
import { Textarea } from "@/components/ui/textarea";
import { updateCampaign, deleteCampaign } from '@/app/actions';

interface Campaign {
    id: number;
    title: string;
    description: string;
    priority: string;
    affectedProducts: string | null;
    bulletinUrl: string | null;
}

export function EditCampaignDialog({ campaign }: { campaign: Campaign }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-nautical-secondary bg-white/80 shadow-sm border border-gray-100">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Editar Campaña</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de la campaña técnica o boletín.
                    </DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    await updateCampaign(formData);
                    setOpen(false);
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="id" value={campaign.id} />
                    <div className="grid gap-2">
                        <Label htmlFor="edit-title">Título</Label>
                        <Input id="edit-title" name="title" defaultValue={campaign.title} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-priority">Prioridad</Label>
                            <select
                                name="priority"
                                defaultValue={campaign.priority}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="Routine">Rutina</option>
                                <option value="Safety">Seguridad</option>
                                <option value="Urgent">Urgente</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-products">Modelos Afectados</Label>
                            <Input id="edit-products" name="affectedProducts" defaultValue={campaign.affectedProducts ?? ''} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-desc">Descripción Técnica</Label>
                        <Textarea id="edit-desc" name="description" defaultValue={campaign.description} required className="min-h-[100px]" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-file">Reemplazar PDF (Opcional)</Label>
                        <Input id="edit-file" name="bulletinFile" type="file" accept=".pdf" />
                        {campaign.bulletinUrl && (
                            <p className="text-[10px] text-gray-500 italic">
                                Archivo actual: {campaign.bulletinUrl.split('/').pop()}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                            onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar esta campaña?')) {
                                    const formData = new FormData();
                                    formData.append('id', campaign.id.toString());
                                    await deleteCampaign(formData);
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
