'use client';

import { useState } from 'react';
import { Upload, Check, FileJson, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DataImporter({ onImport }: { onImport: (data: any) => void }) {
    const [fileData, setFileData] = useState<any[] | null>(null);
    const [fileKeys, setFileKeys] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [mapping, setMapping] = useState<Record<string, string>>({
        name: '',
        brand: '',
        category: '',
        series: '',
        price: '',
        description: '',
        specs: '' // Any remaining unmapped fields will go here
    });
    const [manualValues, setManualValues] = useState<Record<string, string>>({});

    const pimFields = [
        { key: 'name', label: 'Nombre del Producto', required: true },
        { key: 'brand', label: 'Marca', required: true },
        { key: 'category', label: 'Categoría', required: true },
        { key: 'series', label: 'Serie/Gama', required: false },
        { key: 'price', label: 'Precio Sugerido', required: false },
        { key: 'description', label: 'Descripción', required: false },
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                const dataArray = Array.isArray(json) ? json : [json];

                if (dataArray.length > 0) {
                    setFileData(dataArray);
                    // Extract keys from all objects to get a comprehensive physical list
                    const allKeys = new Set<string>();
                    dataArray.forEach(item => {
                        Object.keys(item).forEach(k => allKeys.add(k));
                    });
                    setFileKeys(Array.from(allKeys));
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("El archivo no es un JSON válido.");
            }
        };

        reader.readAsText(file);
    };

    const handleMappingChange = (pimKey: string, fileKey: string) => {
        setMapping(prev => ({
            ...prev,
            [pimKey]: fileKey
        }));
    };

    const handleManualValueChange = (pimKey: string, value: string) => {
        setManualValues(prev => ({
            ...prev,
            [pimKey]: value
        }));
    };

    const processImport = () => {
        if (!fileData) return;

        // Validar requeridos (deben estar mapeados o tener un valor manual)
        const missing = pimFields.filter(f => f.required && !mapping[f.key] && !manualValues[f.key]);
        if (missing.length > 0) {
            alert(`Faltan campos requeridos por mapear o rellenar: ${missing.map(m => m.label).join(', ')}`);
            return;
        }

        const processedData = fileData.map(item => {
            const newItem: any = {};
            const specsObject: Record<string, any> = {};

            // Mapeo directo
            pimFields.forEach(field => {
                const sourceKey = mapping[field.key];
                if (sourceKey && item[sourceKey] !== undefined) {
                    newItem[field.key] = item[sourceKey];
                } else if (manualValues[field.key]) {
                    // Usar valor manual de respaldo si no hay mapeo pero se escribió algo
                    newItem[field.key] = manualValues[field.key];
                }
            });

            // Resto de campos van a specs
            const mappedKeys = Object.values(mapping).filter(Boolean);
            Object.keys(item).forEach(key => {
                if (!mappedKeys.includes(key)) {
                    specsObject[key] = item[key];
                }
            });

            newItem.specs = Object.keys(specsObject).length > 0 ? JSON.stringify(specsObject) : "{}";

            // Si el mapeo genera un número para el precio
            if (newItem.price) {
                newItem.price = typeof newItem.price === 'string' ? parseFloat(newItem.price.replace(/[^0-9.-]+/g, "")) : Number(newItem.price);
            }

            return newItem;
        });

        onImport(processedData);
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 space-y-8 animate-in mt-6">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="bg-nautical-accent/10 p-3 rounded-xl text-nautical-accent">
                    <FileJson className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-nautical-primary">Asistente de Importación</h3>
                    <p className="text-sm text-slate-500">Sube un archivo JSON y mapea los campos de tu proveedor</p>
                </div>
            </div>

            {!fileData ? (
                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer relative group">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="font-bold text-nautical-primary">Selecciona o arrastra un archivo JSON</p>
                    <p className="text-sm text-slate-400 mt-2">Soporta arrays de objetos o un objeto único</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <FileJson className="h-5 w-5 text-nautical-accent" />
                            <span className="font-bold text-nautical-primary">{fileName}</span>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium">
                                {fileData.length} registros detectados
                            </span>
                        </div>
                        <button
                            onClick={() => { setFileData(null); setFileKeys([]); setFileName(''); }}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-100 px-6 py-4 flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                            <div className="flex-1">Campo PIM Destino</div>
                            <div className="flex-1">Campo Proveedor Origen</div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {pimFields.map((field) => (
                                <div key={field.key} className="flex flex-col sm:flex-row gap-4 px-6 py-4 items-center">
                                    <div className="flex-1 flex gap-2 items-center w-full">
                                        <div className="font-medium text-sm text-nautical-primary">{field.label}</div>
                                        {field.required && (
                                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Req</span>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        <div className="relative">
                                            <select
                                                value={mapping[field.key] || ''}
                                                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-nautical-accent/20 focus:border-nautical-accent text-sm font-medium transition-all"
                                            >
                                                <option value="" className="text-slate-400">--- Valor Manual Fijo / Sin Mapeo ---</option>
                                                {fileKeys.map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                                <Settings2 className="h-4 w-4" />
                                            </div>
                                        </div>

                                        {!mapping[field.key] && (
                                            <input
                                                type={field.key === 'price' ? 'number' : 'text'}
                                                value={manualValues[field.key] || ''}
                                                onChange={(e) => handleManualValueChange(field.key, e.target.value)}
                                                placeholder={`Fijar valor para todos (ej. ${field.key === 'brand' ? 'Mercury' : field.key === 'category' ? 'Engine' : 'Valor predeterminado'})`}
                                                className={`w-full bg-white border ${field.required && !manualValues[field.key] ? 'border-amber-300 focus:border-amber-500 ring-amber-500/20' : 'border-slate-200 focus:border-nautical-accent ring-nautical-accent/20'} text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 text-sm font-medium transition-all shadow-inner`}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50/50 p-4 text-xs text-nautical-secondary font-medium border-t border-slate-200 text-center">
                            * Los campos del proveedor no asignados se guardarán automáticamente en las Especificaciones (JSON)
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={processImport}
                            className="bg-nautical-primary hover:bg-nautical-accent text-white rounded-xl px-8 shadow-lg transition-all flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" /> Importar Datos
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
