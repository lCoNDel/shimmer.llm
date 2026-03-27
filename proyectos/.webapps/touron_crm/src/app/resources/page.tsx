import { db } from '@/lib/db';
import { resources } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, BookOpen, Anchor, Plus } from 'lucide-react';
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
import { addResource } from '@/app/actions';
import { EditResourceDialog } from '@/components/EditResourceDialog';

export default async function ResourcesPage() {
    const docs = await db.select().from(resources);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-nautical-primary">Hub Técnico</h2>
                    <p className="text-gray-500">Manuales de servicio, diagramas y documentación oficial.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            className="pl-9 bg-white border-gray-200 h-10 shadow-sm"
                        />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-nautical-secondary hover:bg-nautical-primary text-white gap-2 shadow-md">
                                <Plus className="h-4 w-4" /> Nuevo Recurso
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white text-nautical-primary">
                            <DialogHeader>
                                <DialogTitle>Cargar Nuevo Recurso</DialogTitle>
                                <DialogDescription>
                                    Añade manuales o diagramas PDF para la red de servicio.
                                </DialogDescription>
                            </DialogHeader>
                            <form action={addResource} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Título</Label>
                                    <Input id="title" name="title" placeholder="Ej: Manual de Taller V8 4.6L" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Tipo</Label>
                                        <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                                            <option value="Manual">Manual</option>
                                            <option value="Diagram">Diagrama</option>
                                            <option value="Software">Software</option>
                                            <option value="Bulletin">Boletín</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Categoría</Label>
                                        <Input id="category" name="category" placeholder="Ej: Outboard" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="url">Archivo (PDF/ZIP)</Label>
                                    <Input id="url" name="url" type="file" required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full">Publicar Recurso</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-nautical-primary text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-nautical-accent italic">
                            <Anchor className="h-5 w-5" />
                            Acceso Rápido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-300 mb-4">Herramientas esenciales para el diagnóstico Mercury.</p>
                        <div className="flex flex-col gap-2">
                            <Button variant="secondary" className="w-full justify-start text-nautical-primary hover:bg-white font-semibold">
                                <BookOpen className="mr-2 h-4 w-4" /> SmartCraft G3
                            </Button>
                            <Button variant="secondary" className="w-full justify-start text-nautical-primary hover:bg-white font-semibold">
                                <Anchor className="mr-2 h-4 w-4" /> VesselView Mobile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {docs.map((doc) => (
                    <Card key={doc.id} className="hover:border-nautical-accent/50 transition-all group relative border-slate-100 shadow-sm hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg ${doc.type === 'Manual' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {doc.type === 'Manual' ? <BookOpen className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-200 uppercase tracking-tighter">
                                        {doc.category}
                                    </Badge>
                                    <EditResourceDialog resource={doc} />
                                </div>
                            </div>
                            <CardTitle className="text-base leading-tight group-hover:text-nautical-primary transition-colors pr-6">
                                {doc.title}
                            </CardTitle>
                            <CardDescription className="text-[10px] mt-2 flex items-center gap-2 text-slate-400">
                                <FileText className="h-3 w-3" />
                                {doc.type.toUpperCase()} • 2.4 MB
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="ghost" className="w-full justify-between text-nautical-secondary hover:text-nautical-primary hover:bg-slate-50 font-medium h-9 text-xs">
                                    Ver Documento
                                    <Download className="h-4 w-4" />
                                </Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
