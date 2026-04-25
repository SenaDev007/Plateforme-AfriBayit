'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KycReviewModal } from '@/components/admin/KycReviewModal';
import { Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PendingKyc {
  id: string;
  type: string;
  fileUrl: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function KycPage() {
  const { data: session } = useSession();
  const [pendingDocs, setPendingDocs] = useState<PendingKyc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<PendingKyc | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPendingKyc() {
    const token = session?.accessToken;
    if (!token) return;
    setIsLoading(true);
    try {
      const { data } = await api.users.getPendingKyc(token);
      setPendingDocs(data as PendingKyc[]);
    } catch {
      toast.error('Erreur lors du chargement des demandes KYC');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchPendingKyc();
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vérification KYC</h1>
          <p className="text-muted-foreground">
            Révisez et approuvez les documents d'identité des utilisateurs.
          </p>
        </div>
        <Button variant="outline" onClick={() => void fetchPendingKyc()} disabled={isLoading}>
          <Clock className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Date de soumission</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingDocs.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-10 text-center">
                  Aucune demande KYC en attente.
                </TableCell>
              </TableRow>
            ) : (
              pendingDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="font-medium">
                      {doc.user.firstName} {doc.user.lastName}
                    </div>
                    <div className="text-muted-foreground text-xs">{doc.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doc.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      className="gap-2"
                    >
                      <Eye size={16} /> Examiner
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDoc && (
        <KycReviewModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onSuccess={() => void fetchPendingKyc()}
        />
      )}
    </div>
  );
}
