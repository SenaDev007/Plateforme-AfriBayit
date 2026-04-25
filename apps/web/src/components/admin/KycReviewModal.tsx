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
import { toast } from 'sonner';

interface PendingKyc {
  id: string;
  type: string;
  fileUrl: string;
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

export function KycReviewModal({ doc, onClose, onSuccess }: KycReviewModalProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Révision du document KYC</DialogTitle>
          <DialogDescription>
            Vérifiez l'identité de {doc.user.firstName} {doc.user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-2">
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

          <div className="flex flex-col gap-6 rounded-xl border bg-slate-50 p-4">
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
