import { db } from '@/lib/db';
import { campaigns } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Calendar, Download, Megaphone, Plus, Trash2, Edit } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addCampaign } from '../actions';
import { EditCampaignDialog } from '@/components/EditCampaignDialog';

export default async function CampaignsPage() {
    const lobby = await db.select().from(campaigns).orderBy(desc(campaigns.releaseDate));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-nautical-primary">Campañas y Boletines</h2>
                    <p className="text-gray-500">Actualizaciones técnicas obligatorias y noticias de servicio.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-nautical-secondary hover:bg-nautical-primary text-white gap-2">
                            <Plus className="h-4 w-4" /> Nueva Campaña
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white">
                        <DialogHeader>
                            <DialogTitle>Publicar Nueva Campaña</DialogTitle>
                            <DialogDescription>
                                Los archivos adjuntos se subirán al servidor del CRM.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={addCampaign} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" name="title" placeholder="Ej: Recall Bomba de Agua V6" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Prioridad</Label>
                                    <select name="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option value="Routine">Rutina</option>
                                        <option value="Safety">Seguridad</option>
                                        <option value="Urgent">Urgente</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="affectedProducts">Modelos Afectados</Label>
                                    <Input id="affectedProducts" name="affectedProducts" placeholder="Ej: Mercury V6 2018-2022" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción Técnica</Label>
                                <Textarea id="description" name="description" placeholder="Detalles de la campaña..." required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bulletinFile">Adjuntar PDF Original</Label>
                                <Input id="bulletinFile" name="bulletinFile" type="file" accept=".pdf" />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full">Publicar Boletín</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lobby.map((camp) => (
                    <Card key={camp.id} className={`border-l-4 relative group transition-all hover:shadow-md ${camp.priority === 'Urgent' ? 'border-l-red-500 shadow-red-50' :
                        camp.priority === 'Safety' ? 'border-l-orange-500' : 'border-l-blue-500'
                        }`}>

                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant={camp.priority === 'Urgent' ? 'destructive' : 'secondary'}>
                                        {camp.priority === 'Urgent' ? 'Urgente' : camp.priority === 'Safety' ? 'Seguridad' : 'Rutina'}
                                    </Badge>
                                    {camp.priority === 'Urgent' && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
                                    {camp.priority === 'Routine' && <Megaphone className="h-4 w-4 text-blue-500" />}
                                </div>
                                <EditCampaignDialog campaign={{
                                    ...camp,
                                    priority: camp.priority as string
                                }} />
                            </div>
                            <CardTitle className="leading-tight text-xl">{camp.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(camp.releaseDate).toLocaleDateString('es-ES')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{camp.description}</p>
                            {camp.affectedProducts && (
                                <div className="bg-gray-50 p-3 rounded-md text-xs border border-gray-100">
                                    <span className="font-semibold block mb-1 text-nautical-primary uppercase tracking-wider text-[10px]">Productos Afectados:</span>
                                    {camp.affectedProducts}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <a href={camp.bulletinUrl || `/api/campaigns/${camp.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button variant="outline" className={`w-full gap-2 ${camp.bulletinUrl ? 'border-nautical-secondary text-nautical-secondary hover:bg-nautical-secondary hover:text-white' : ''}`}>
                                    <Download className="h-4 w-4" />
                                    {camp.bulletinUrl ? 'Descargar Adjunto Real' : 'Generar Boletín Técnico'}
                                </Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
