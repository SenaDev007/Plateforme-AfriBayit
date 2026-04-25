'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button, Card, Input } from '@afribayit/ui';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface KycUploadFormProps {
  level: number;
  onSuccess: () => void;
}

const DOC_TYPES = [
  { value: 'CNI', label: "Carte Nationale d'Identité" },
  { value: 'PASSPORT', label: 'Passeport' },
  { value: 'VOTER_CARD', label: "Carte d'Électeur" },
];

export function KycUploadForm({ level, onSuccess }: KycUploadFormProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentType, setDocumentType] = useState('CNI');

  async function handleUpload() {
    const token = session?.accessToken;
    if (!file || !token) return;

    setIsUploading(true);
    try {
      const {
        data: { uploadUrl, fileKey, publicUrl },
      } = await api.properties.presignUpload(file.type, token);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) throw new Error("Échec de l'upload vers le cloud");

      await api.users.submitKyc(
        {
          type: documentType,
          fileUrl: publicUrl,
          fileKey: fileKey,
          level: `LEVEL_${level}`,
        },
        token,
      );

      toast.success('Document soumis avec succès ! Il sera vérifié par notre équipe.');
      onSuccess();
    } catch (error) {
      console.error('KYC Upload Error:', error);
      toast.error('Une erreur est survenue lors de la soumission du document.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="space-y-6 p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Soumission du document</h3>
        <p className="text-muted-foreground text-sm">
          Veuillez uploader un document officiel pour valider le niveau {level}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de document</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hover:border-navy group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition-colors">
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              accept="image/*,application/pdf"
            />
            <Upload className="group-hover:text-navy mb-3 h-10 w-10 text-slate-400 transition-colors" />
            <p className="text-sm font-medium text-slate-600">
              {file ? file.name : 'Cliquez ou glissez votre fichier ici'}
            </p>
            <p className="mt-1 text-xs text-slate-400">JPG, PNG ou PDF (max 5Mo)</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-slate-100 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Sécurité des données</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Vos documents sont cryptés et stockés sécurisément sur nos serveurs. Ils ne seront
              utilisés que pour la vérification de votre identité.
            </p>
          </div>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="mt-6 w-full">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? 'Upload en cours...' : 'Soumettre le document'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
