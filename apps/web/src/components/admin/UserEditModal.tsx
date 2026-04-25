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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface UserEditModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserEditModal({ user, onClose, onSuccess }: UserEditModalProps) {
  const { data: session } = useSession();
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpdateRole() {
    const token = session?.accessToken;
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.users.updateUserRole(user.id, { role }, token);
      toast.success('Rôle mis à jour');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erreur lors du changement de rôle');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateStatus() {
    const token = session?.accessToken;
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.users.updateUserStatus(user.id, { status }, token);
      toast.success('Statut du compte mis à jour');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erreur lors du changement de statut');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gérer l'utilisateur</DialogTitle>
          <DialogDescription>
            Modification des privilèges et du statut de {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Rôle du compte</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUYER">Acheteur</SelectItem>
                <SelectItem value="SELLER">Vendeur</SelectItem>
                <SelectItem value="INVESTOR">Investisseur</SelectItem>
                <SelectItem value="TOURIST">Touriste</SelectItem>
                <SelectItem value="ARTISAN">Artisan</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Statut du compte</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="BANNED">Banni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => void handleUpdateRole()}
              disabled={isSubmitting}
              variant="secondary"
            >
              Mettre à jour le rôle
            </Button>
            <Button
              onClick={() => void handleUpdateStatus()}
              disabled={isSubmitting}
              className={
                status === 'BANNED'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {isSubmitting ? 'Envoi...' : 'Valider le statut'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
