"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Loader2,
  Heart,
  Eye,
  Trash2,
  Copy,
  ExternalLink,
  Users,
  Mail,
  Calendar,
  Globe,
  EyeOff,
  MoreHorizontal,
  CreditCard,
  Gift,
  Clock,
  CheckCircle,
  Link2,
  LinkIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminGuard from "@/components/admin/AdminGuard";

interface InvitationSummary {
  _id: Id<"weddingInvitations">;
  slug: string;
  accessCode: string;
  ownerEmail: string;
  person1Name: string;
  person2Name: string;
  eventDate: string;
  isActive: boolean;
  isPublished: boolean;
  viewCount: number;
  rsvpCount: number;
  confirmedGuests: number;
  declinedGuests: number;
  // Payment fields
  isPaid: boolean;
  paymentStatus?: "pending" | "paid" | "free_booking";
  linkedBookingId?: Id<"bookings">;
}

interface RsvpData {
  _id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  numberOfGuests: number;
  willAttend: boolean;
  dietaryRestrictions?: string;
  message?: string;
  createdAt: number;
}

interface NewInvitationForm {
  person1Name: string;
  person2Name: string;
  ownerEmail: string;
  eventDate: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  celebrationLocation: string;
  celebrationAddress: string;
  bookingId?: Id<"bookings">;
  templateId: string;
}

const initialFormState: NewInvitationForm = {
  person1Name: "",
  person2Name: "",
  ownerEmail: "",
  eventDate: "",
  ceremonyDate: "",
  ceremonyTime: "",
  ceremonyLocation: "",
  ceremonyAddress: "",
  celebrationLocation: "Ruka Lefun",
  celebrationAddress: "Villarrica, Chile",
  templateId: "classic",
};

export default function AdminInvitacionesPage() {
  const [viewingRsvps, setViewingRsvps] = useState<Id<"weddingInvitations"> | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [linkingInvitation, setLinkingInvitation] = useState<Id<"weddingInvitations"> | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  const invitations = useQuery(api.weddingInvitations.getAll);
  const rsvps = useQuery(
    api.weddingInvitations.getRsvps,
    viewingRsvps ? { invitationId: viewingRsvps } : "skip"
  );
  const activeBookings = useQuery(api.weddingInvitations.getActiveBookings);

  const deleteInvitation = useMutation(api.weddingInvitations.remove);
  const toggleActive = useMutation(api.weddingInvitations.toggleActive);
  const markAsPaid = useMutation(api.weddingInvitations.markAsPaid);
  const linkToBooking = useMutation(api.weddingInvitations.linkToBooking);

  // Filter invitations based on payment status
  const filteredInvitations = invitations?.filter((inv: InvitationSummary) => {
    if (paymentFilter === "all") return true;
    if (paymentFilter === "paid") return inv.isPaid;
    if (paymentFilter === "pending") return !inv.isPaid;
    if (paymentFilter === "free") return inv.paymentStatus === "free_booking";
    return true;
  });

  const handleDelete = async (id: Id<"weddingInvitations">) => {
    if (!confirm("¿Estas seguro de eliminar esta invitacion? Esta accion no se puede deshacer.")) {
      return;
    }

    try {
      await deleteInvitation({ id });
      toast.success("Invitacion eliminada");
    } catch (error) {
      toast.error("Error al eliminar");
      console.error(error);
    }
  };

  const handleToggleActive = async (id: Id<"weddingInvitations">) => {
    try {
      await toggleActive({ id });
      toast.success("Estado actualizado");
    } catch (error) {
      toast.error("Error al actualizar");
      console.error(error);
    }
  };

  const handleMarkAsPaid = async (id: Id<"weddingInvitations">) => {
    try {
      await markAsPaid({ id });
      toast.success("Invitacion marcada como pagada");
    } catch (error) {
      toast.error("Error al marcar como pagada");
      console.error(error);
    }
  };

  const handleLinkToBooking = async () => {
    if (!linkingInvitation || !selectedBookingId) return;

    try {
      await linkToBooking({
        invitationId: linkingInvitation,
        bookingId: selectedBookingId as Id<"bookings">,
      });
      toast.success("Invitacion vinculada a reserva - ahora es gratis");
      setLinkingInvitation(null);
      setSelectedBookingId("");
    } catch (error) {
      toast.error("Error al vincular la invitacion");
      console.error(error);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  const getPaymentBadge = (invitation: InvitationSummary) => {
    if (invitation.paymentStatus === "free_booking") {
      return (
        <Badge className="bg-green-100 text-green-700 gap-1">
          <Gift className="w-3 h-3" />
          Gratis
        </Badge>
      );
    }
    if (invitation.isPaid) {
      return (
        <Badge className="bg-blue-100 text-blue-700 gap-1">
          <CheckCircle className="w-3 h-3" />
          Pagado
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-100 text-amber-700 gap-1">
        <Clock className="w-3 h-3" />
        Pendiente
      </Badge>
    );
  };

  return (
    <AdminGuard>
      <Toaster />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Invitaciones Digitales
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona las invitaciones de matrimonio digitales
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Payment Filter */}
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="paid">Pagadas</SelectItem>
                <SelectItem value="pending">Pendientes de pago</SelectItem>
                <SelectItem value="free">Gratis (con reserva)</SelectItem>
              </SelectContent>
            </Select>

            {/* Link to public page */}
            <a href="/invitaciones" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Link2 className="w-4 h-4" />
                Ver Pagina Publica
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        {invitations && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Invitaciones</p>
              <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Activas (Pagadas)</p>
              <p className="text-2xl font-bold text-green-600">
                {invitations.filter((i: InvitationSummary) => i.isPaid).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Pendientes Pago</p>
              <p className="text-2xl font-bold text-amber-600">
                {invitations.filter((i: InvitationSummary) => !i.isPaid).length}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Confirmados</p>
              <p className="text-2xl font-bold text-nature-forest">
                {invitations.reduce((sum: number, i: InvitationSummary) => sum + i.confirmedGuests, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Visitas</p>
              <p className="text-2xl font-bold text-blue-600">
                {invitations.reduce((sum: number, i: InvitationSummary) => sum + i.viewCount, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {invitations === undefined ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Cargando invitaciones...</p>
            </div>
          ) : filteredInvitations?.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                {paymentFilter === "all"
                  ? "No hay invitaciones creadas"
                  : "No hay invitaciones con este filtro"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Las invitaciones se crean desde la pagina publica /invitaciones
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pareja</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Confirmados</TableHead>
                  <TableHead className="text-center">Visitas</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations?.map((invitation: InvitationSummary) => (
                  <TableRow key={invitation._id}>
                    <TableCell>
                      <div className="font-medium">
                        {invitation.person1Name} & {invitation.person2Name}
                      </div>
                      <div className="text-xs text-gray-500">
                        /{invitation.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {invitation.ownerEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(invitation.eventDate).toLocaleDateString("es-CL")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {invitation.accessCode}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            copyToClipboard(invitation.accessCode, "Codigo")
                          }
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(invitation)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {invitation.isPublished ? (
                          <Badge className="bg-green-100 text-green-700 gap-1">
                            <Globe className="w-3 h-3" />
                            Publicada
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <EyeOff className="w-3 h-3" />
                            Borrador
                          </Badge>
                        )}
                        {!invitation.isActive && (
                          <Badge variant="destructive">Inactiva</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={() => setViewingRsvps(invitation._id)}
                      >
                        <Users className="w-4 h-4" />
                        {invitation.rsvpCount}
                        {invitation.confirmedGuests > 0 && (
                          <span className="text-green-600">
                            ({invitation.confirmedGuests})
                          </span>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {invitation.viewCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invitation.isPublished && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(`/invitacion/${invitation.slug}`, "_blank")
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ver Invitacion
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/invitacion/${invitation.slug}`,
                                "Link"
                              )
                            }
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </DropdownMenuItem>
                          {!invitation.isPaid && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsPaid(invitation._id)}
                              className="text-green-600"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Marcar como Pagado
                            </DropdownMenuItem>
                          )}
                          {!invitation.linkedBookingId && (
                            <DropdownMenuItem
                              onClick={() => {
                                setLinkingInvitation(invitation._id);
                                setSelectedBookingId("");
                              }}
                              className="text-blue-600"
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Vincular a Reserva
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(invitation._id)}
                          >
                            {invitation.isActive ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Globe className="w-4 h-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(invitation._id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Vincular a Reserva Dialog */}
        <Dialog
          open={!!linkingInvitation}
          onOpenChange={(open) => {
            if (!open) {
              setLinkingInvitation(null);
              setSelectedBookingId("");
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-600" />
                Vincular a Reserva
              </DialogTitle>
              <DialogDescription>
                Al vincular esta invitacion a una reserva, se marcara automaticamente como gratis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {activeBookings === undefined ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : activeBookings.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay reservas activas disponibles
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Seleccionar Reserva</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                      {activeBookings.map((booking) => (
                        <button
                          key={booking._id}
                          type="button"
                          onClick={() => setSelectedBookingId(booking._id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedBookingId === booking._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-sm text-gray-500">
                            {booking.eventType} - {new Date(booking.eventDate).toLocaleDateString("es-CL")}
                          </p>
                          <p className="text-xs text-gray-400">{booking.clientEmail}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedBookingId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        <Gift className="w-4 h-4 inline mr-1" />
                        La invitacion sera marcada como <strong>gratis</strong> al vincularse.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setLinkingInvitation(null);
                        setSelectedBookingId("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!selectedBookingId}
                      onClick={handleLinkToBooking}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Vincular
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmaciones Dialog */}
        <Dialog open={!!viewingRsvps} onOpenChange={() => setViewingRsvps(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Confirmaciones de Asistencia</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {rsvps === undefined ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </div>
              ) : rsvps.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay respuestas aun
                </div>
              ) : (
                <div className="space-y-3">
                  {rsvps.map((rsvp: RsvpData) => (
                    <div
                      key={rsvp._id}
                      className={`p-4 rounded-lg border ${
                        rsvp.willAttend
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{rsvp.guestName}</p>
                          {rsvp.guestEmail && (
                            <p className="text-sm text-gray-600">{rsvp.guestEmail}</p>
                          )}
                          {rsvp.guestPhone && (
                            <p className="text-sm text-gray-600">{rsvp.guestPhone}</p>
                          )}
                        </div>
                        <Badge
                          className={
                            rsvp.willAttend
                              ? "bg-green-600"
                              : "bg-red-600"
                          }
                        >
                          {rsvp.willAttend
                            ? `Asistira (${rsvp.numberOfGuests})`
                            : "No asistira"}
                        </Badge>
                      </div>
                      {rsvp.dietaryRestrictions && (
                        <p className="text-sm mt-2">
                          <strong>Restricciones:</strong> {rsvp.dietaryRestrictions}
                        </p>
                      )}
                      {rsvp.message && (
                        <p className="text-sm mt-2 italic text-gray-600">
                          &quot;{rsvp.message}&quot;
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(rsvp.createdAt).toLocaleString("es-CL")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
