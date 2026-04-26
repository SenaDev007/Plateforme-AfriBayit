'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle } from 'lucide-react';

interface AiAnalysis {
  status: 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'ERROR';
  score: number;
  recommendation: 'APPROVE' | 'MANUAL_REVIEW' | 'REJECT';
  documentType?: string;
  extractedData?: {
    fullName?: string | null;
    documentNumber?: string | null;
    expiryDate?: string | null;
    nationality?: string | null;
    dateOfBirth?: string | null;
  };
  fraudIndicators?: string[];
  summary?: string;
}

interface PendingKyc {
  id: string;
  type: string;
  fileUrl: string;
  aiStatus?: string | null;
  aiScore?: number | null;
  aiAnalysis?: AiAnalysis | null;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface KycReviewModalProps {
  doc: PendingKyc;
  onClose: () => void;
  onSuccess: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <span className="text-lg font-bold text-green-600">{score}/100</span>;
  if (score >= 40) return <span className="text-lg font-bold text-amber-600">{score}/100</span>;
  return <span className="text-lg font-bold text-red-600">{score}/100</span>;
}

function AiPanel({ analysis }: { analysis: AiAnalysis }) {
  const statusConfig = {
    VALID: {
      icon: ShieldCheck,
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'Valide',
    },
    SUSPICIOUS: {
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      label: 'Suspect',
    },
    INVALID: { icon: ShieldX, color: 'text-red-600 bg-red-50 border-red-200', label: 'Invalide' },
    ERROR: {
      icon: AlertTriangle,
      color: 'text-slate-500 bg-slate-50 border-slate-200',
      label: 'Erreur',
    },
  };

  const recConfig = {
    APPROVE: { variant: 'default' as const, label: 'Approuver' },
    MANUAL_REVIEW: { variant: 'secondary' as const, label: 'Révision manuelle' },
    REJECT: { variant: 'destructive' as const, label: 'Rejeter' },
  };

  const cfg = statusConfig[analysis.status] ?? statusConfig.ERROR;
  const rec = recConfig[analysis.recommendation] ?? recConfig.MANUAL_REVIEW;
  const Icon = cfg.icon;
  const extracted = analysis.extractedData ?? {};
  const extractedEntries = [
    { label: 'Nom complet', value: extracted.fullName },
    { label: 'N° document', value: extracted.documentNumber },
    { label: 'Date expiration', value: extracted.expiryDate },
    { label: 'Nationalité', value: extracted.nationality },
    { label: 'Date naissance', value: extracted.dateOfBirth },
  ].filter((e) => e.value);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-slate-700">Analyse IA</p>

      <div className={`flex items-center gap-3 rounded-lg border p-3 ${cfg.color}`}>
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">{cfg.label}</p>
          {analysis.summary && <p className="text-xs opacity-80">{analysis.summary}</p>}
        </div>
        {analysis.score != null && <ScoreBadge score={analysis.score} />}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Recommandation IA :</span>
        <Badge variant={rec.variant}>{rec.label}</Badge>
      </div>

      {extractedEntries.length > 0 && (
        <div className="rounded-lg border bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Données extraites
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {extractedEntries.map(({ label, value }) => (
              <>
                <dt key={`dt-${label}`} className="text-slate-400">
                  {label}
                </dt>
                <dd key={`dd-${label}`} className="truncate font-medium text-slate-700">
                  {value}
                </dd>
              </>
            ))}
          </dl>
        </div>
      )}

      {analysis.fraudIndicators && analysis.fraudIndicators.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-red-700">Indicateurs de fraude</p>
          <ul className="space-y-1">
            {analysis.fraudIndicators.map((indicator) => (
              <li key={indicator} className="flex items-start gap-1.5 text-xs text-red-700">
                <span className="mt-0.5 shrink-0">•</span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function KycReviewModal({ doc, onClose, onSuccess }: KycReviewModalProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>(() => {
    if (doc.aiAnalysis?.recommendation === 'APPROVE') return 'APPROVED';
    if (doc.aiAnalysis?.recommendation === 'REJECT') return 'REJECTED';
    return 'APPROVED';
  });
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const token = session?.accessToken;
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.users.reviewKyc(doc.id, { status, note }, token);
      toast.success(`Document ${status === 'APPROVED' ? 'approuvé' : 'rejeté'} avec succès`);
      onSuccess();
      onClose();
    } catch {
      toast.error('Erreur lors de la mise à jour du document');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Révision du document KYC</DialogTitle>
          <DialogDescription>
            Vérifiez l'identité de {doc.user.firstName} {doc.user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
          {/* Document image */}
          <div className="flex flex-col gap-4">
            <Label className="text-sm font-semibold">Document soumis ({doc.type})</Label>
            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg border bg-slate-100">
              <img
                src={doc.fileUrl}
                alt="KYC Document"
                className="max-h-[500px] max-w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-5 overflow-y-auto rounded-xl border bg-slate-50 p-4">
            {/* AI analysis */}
            {doc.aiAnalysis ? (
              <AiPanel analysis={doc.aiAnalysis} />
            ) : doc.aiStatus === 'ERROR' ? (
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-400">
                L'analyse IA a rencontré une erreur pour ce document.
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-400">
                Analyse IA en cours ou non disponible…
              </div>
            )}

            <hr className="border-slate-200" />

            {/* Decision */}
            <div className="space-y-2">
              <Label htmlFor="status">Décision</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as 'APPROVED' | 'REJECTED')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approuver ✅</SelectItem>
                  <SelectItem value="REJECTED">Rejeter ❌</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note de révision (Optionnel)</Label>
              <Textarea
                id="note"
                placeholder="Expliquez la raison du rejet ou ajoutez une observation..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-white"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                className={
                  status === 'REJECTED'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                {isSubmitting ? 'Envoi...' : 'Confirmer la décision'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
