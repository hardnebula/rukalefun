"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Loader2,
  FileText,
  Image as ImageIcon,
  Palette,
  Eye,
  ExternalLink,
  Globe,
  EyeOff,
  LogOut,
  Check,
  Lock,
} from "lucide-react";
import InfoTab from "@/components/invitations/editor/InfoTab";
import GalleryTab from "@/components/invitations/editor/GalleryTab";
import InvitationPreview from "@/components/invitations/InvitationPreview";
import PaymentModal from "@/components/invitations/editor/PaymentModal";
import { invitationTemplates, getTemplateColors, getTemplateFloralConfig } from "@/components/invitations/templates";
import { FloralTop, FloralDivider, SingleRose, WildflowerCluster, MinimalFlower } from "@/components/invitations/decorations";
import { SaveStatus } from "@/components/invitations/editor/SaveStatusIndicator";

interface RsvpData {
  _id: string;
  guestName: string;
  guestEmail?: string;
  numberOfGuests: number;
  willAttend: boolean;
  message?: string;
  createdAt: number;
}

interface GiftLink {
  name: string;
  url?: string;
  description?: string;
}

interface InvitationData {
  person1Name: string;
  person2Name: string;
  eventDate: string;
  welcomeText?: string;
  loveQuote?: string;
  loveQuoteAuthor?: string;
  ceremonyDate: string;
  ceremonyTime: string;
  ceremonyLocation: string;
  ceremonyAddress: string;
  ceremonyMapsUrl?: string;
  celebrationDate?: string;
  celebrationTime?: string;
  celebrationLocation?: string;
  celebrationAddress?: string;
  celebrationMapsUrl?: string;
  dressCode?: string;
  dressCodeDescription?: string;
  additionalNotes?: string;
  rsvpDeadline?: string;
  rsvpMessage?: string;
  giftRegistryEnabled?: boolean;
  giftRegistryTitle?: string;
  giftRegistryMessage?: string;
  giftRegistryLinks?: GiftLink[];
}

export default function EditInvitationPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("info");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Live preview and auto-save state
  const [previewData, setPreviewData] = useState<typeof invitation | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check session on mount
  useEffect(() => {
    const email = sessionStorage.getItem("invitation_email");
    const code = sessionStorage.getItem("invitation_code");

    if (!email || !code) {
      router.push("/mi-invitacion");
      return;
    }

    setOwnerEmail(email);
    setAccessCode(code);
  }, [router]);

  // Fetch invitation data
  const invitation = useQuery(
    api.weddingInvitations.getByAccessCode,
    accessCode ? { accessCode } : "skip"
  );

  const publishInvitation = useMutation(api.weddingInvitations.publishInvitation);
  const unpublishInvitation = useMutation(api.weddingInvitations.unpublishInvitation);
  const updateInvitation = useMutation(api.weddingInvitations.updateInvitation);

  // Initialize previewData from invitation
  useEffect(() => {
    if (invitation && !previewData) {
      setPreviewData(invitation);
    }
  }, [invitation, previewData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle field change with live preview and debounced auto-save
  const handleFieldChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (field: keyof InvitationData, value: any) => {
      if (!accessCode || !ownerEmail) return;

      // Update preview immediately
      setPreviewData((prev) => prev ? { ...prev, [field]: value } : prev);
      setSaveStatus("unsaved");

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save (500ms debounce)
      saveTimeoutRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          await updateInvitation({
            accessCode,
            ownerEmail,
            [field]: value,
          });
          setSaveStatus("saved");
        } catch (error) {
          setSaveStatus("error");
          toast.error("Error al guardar");
          console.error(error);
        }
      }, 500);
    },
    [accessCode, ownerEmail, updateInvitation]
  );

  const handleLogout = () => {
    sessionStorage.removeItem("invitation_email");
    sessionStorage.removeItem("invitation_code");
    router.push("/mi-invitacion");
  };

  const handlePublish = async () => {
    if (!accessCode || !ownerEmail) return;

    setIsPublishing(true);
    try {
      const slug = await publishInvitation({ accessCode, ownerEmail });
      toast.success("¡Invitacion publicada!");

      // Copy link to clipboard
      const url = `${window.location.origin}/invitacion/${slug}`;
      await navigator.clipboard.writeText(url);
      toast.info("Link copiado al portapapeles");
    } catch (error) {
      toast.error("Error al publicar la invitacion");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!accessCode || !ownerEmail) return;

    setIsPublishing(true);
    try {
      await unpublishInvitation({ accessCode, ownerEmail });
      toast.success("Invitacion despublicada");
    } catch (error) {
      toast.error("Error al despublicar");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    if (!accessCode || !ownerEmail) return;

    try {
      await updateInvitation({
        accessCode,
        ownerEmail,
        templateId,
      });
      // Update preview data with new template
      setPreviewData((prev) => prev ? { ...prev, templateId } : prev);
      toast.success("Plantilla actualizada");
      // Show payment modal if not paid
      if (invitation && !invitation.isPaid) {
        setShowPaymentModal(true);
      }
    } catch (error) {
      toast.error("Error al cambiar plantilla");
      console.error(error);
    }
  };

  // Loading states
  if (!accessCode || !ownerEmail) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4A7C59] animate-spin" />
      </div>
    );
  }

  if (invitation === undefined) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4A7C59] animate-spin mb-4" />
        <p className="text-[#4A7C59]">Cargando tu invitacion...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md mb-8">
          <FloralTop primaryColor="#4A7C59" secondaryColor="#E8C4C4" />
        </div>
        <h1 className="font-script text-3xl text-[#2D5016] mb-4">
          Sesion no valida
        </h1>
        <p className="text-[#4A7C59] text-center mb-6">
          Tu sesion ha expirado o no es valida.
        </p>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-[#4A7C59] text-[#4A7C59]"
        >
          Volver a iniciar sesion
        </Button>
      </div>
    );
  }

  // Use previewData for display, fallback to invitation
  const displayData = previewData || invitation;
  const invitationUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invitacion/${invitation.slug}`;

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Payment required banner */}
        {!invitation.isPaid && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  Tu invitacion esta en modo edicion. Completa el pago para poder compartirla con tus invitados.
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => router.push(`/invitaciones/pago?id=${invitation._id}`)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Desbloquear
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-script text-2xl text-[#2D5016]">
                  {displayData.person1Name} & {displayData.person2Name}
                </h1>
                <p className="text-sm text-gray-500">
                  Editando tu invitacion
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Publish status */}
                {invitation.isPublished ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <Globe className="w-4 h-4" />
                      Publicada
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(invitationUrl, "_blank")}
                      className="gap-1"
                    >
                      Ver <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUnpublish}
                      disabled={isPublishing}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      {isPublishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {!invitation.isPaid && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Requiere pago
                      </span>
                    )}
                    <Button
                      size="sm"
                      onClick={handlePublish}
                      disabled={isPublishing || !invitation.isPaid}
                      className="bg-[#4A7C59] hover:bg-[#3d6649] gap-2 disabled:opacity-50"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          Publicar
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Logout */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-500"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Published URL */}
            {invitation.isPublished && (
              <div className="mt-3 flex items-center gap-2 bg-[#4A7C59]/10 rounded-lg p-2">
                <span className="text-sm text-[#2D5016]">Link de tu invitacion:</span>
                <code className="text-sm bg-white px-2 py-1 rounded text-[#4A7C59] flex-1 truncate">
                  {invitationUrl}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(invitationUrl);
                    toast.success("Link copiado");
                  }}
                >
                  Copiar
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="info" className="gap-2">
                <FileText className="w-4 h-4" />
                Informacion
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Galeria
              </TabsTrigger>
              <TabsTrigger value="design" className="gap-2">
                <Palette className="w-4 h-4" />
                Diseño
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Info Tab */}
              <TabsContent value="info" className="mt-0">
                <InfoTab
                  data={displayData}
                  onChange={handleFieldChange}
                  saveStatus={saveStatus}
                />
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="mt-0">
                <GalleryTab
                  photos={invitation.photos}
                  accessCode={accessCode}
                  ownerEmail={ownerEmail}
                  onUpdate={() => {}}
                />
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium text-lg text-[#2D5016] mb-2">
                      Selecciona una Plantilla
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Cada plantilla tiene su propio estilo floral y paleta de colores unica
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6">
                      {Object.values(invitationTemplates).map((template) => {
                        const isSelected = displayData.templateId === template.id;
                        const templateDescriptions: Record<string, { title: string; subtitle: string; floralDesc: string }> = {
                          classic: {
                            title: "Clasica",
                            subtitle: "Elegante y atemporal",
                            floralDesc: "Rosas clasicas"
                          },
                          romantic: {
                            title: "Romantica",
                            subtitle: "Suave y delicado",
                            floralDesc: "Flores silvestres"
                          },
                          modern: {
                            title: "Moderna",
                            subtitle: "Minimalista y sofisticado",
                            floralDesc: "Geometrico"
                          }
                        };
                        const desc = templateDescriptions[template.id] || templateDescriptions.classic;

                        return (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateChange(template.id)}
                            className={`
                              relative rounded-2xl border-2 transition-all text-left overflow-hidden group
                              ${isSelected
                                ? "border-[#4A7C59] ring-2 ring-[#4A7C59]/20 shadow-lg"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"}
                            `}
                          >
                            {/* Mini Preview Card */}
                            <div
                              className="h-44 relative overflow-hidden"
                              style={{ backgroundColor: template.colors.background }}
                            >
                              {/* Floral decoration preview */}
                              <div className="absolute inset-x-0 top-0 flex justify-center transform scale-75 origin-top">
                                <div className="w-full max-w-[200px]">
                                  <FloralTop
                                    primaryColor={template.colors.primary}
                                    secondaryColor={template.colors.secondary}
                                    accentColor={template.colors.accent}
                                    floralStyle={template.floralStyle}
                                    animate={false}
                                  />
                                </div>
                              </div>

                              {/* Sample text preview */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                                <span
                                  className="font-script text-2xl"
                                  style={{ color: template.colors.text }}
                                >
                                  Maria
                                </span>
                                <span
                                  className="font-script text-lg my-0.5"
                                  style={{ color: template.colors.primary }}
                                >
                                  &
                                </span>
                                <span
                                  className="font-script text-2xl"
                                  style={{ color: template.colors.text }}
                                >
                                  Juan
                                </span>
                              </div>

                              {/* Floral divider at bottom */}
                              <div className="absolute inset-x-0 bottom-2 flex justify-center transform scale-50 origin-bottom">
                                <FloralDivider
                                  floralStyle={template.floralStyle}
                                  variant="simple"
                                  primaryColor={template.colors.secondary}
                                  secondaryColor={template.colors.primary}
                                  accentColor={template.colors.accent}
                                  width={200}
                                />
                              </div>

                              {/* Selected indicator */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-7 h-7 bg-[#4A7C59] rounded-full flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Template info */}
                            <div className="p-4 bg-white">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{desc.title}</h4>
                                  <p className="text-sm text-gray-500">{desc.subtitle}</p>
                                </div>

                                {/* Floral style indicator */}
                                <div className="flex-shrink-0">
                                  {template.floralStyle === "rose" && (
                                    <SingleRose
                                      primaryColor={template.colors.secondary}
                                      secondaryColor={template.colors.primary}
                                      size={32}
                                      variant="half"
                                      withLeaves={false}
                                    />
                                  )}
                                  {template.floralStyle === "wildflower" && (
                                    <div className="w-8 h-8 flex items-center justify-center">
                                      <svg width="28" height="28" viewBox="0 0 28 28">
                                        {[0, 72, 144, 216, 288].map((angle) => (
                                          <ellipse
                                            key={angle}
                                            cx="14"
                                            cy="8"
                                            rx="3"
                                            ry="6"
                                            fill={template.colors.secondary}
                                            opacity="0.85"
                                            transform={`rotate(${angle}, 14, 14)`}
                                          />
                                        ))}
                                        <circle cx="14" cy="14" r="4" fill={template.colors.accent || template.colors.primary} />
                                      </svg>
                                    </div>
                                  )}
                                  {template.floralStyle === "minimal" && (
                                    <MinimalFlower
                                      color={template.colors.primary}
                                      accentColor={template.colors.secondary}
                                      size={32}
                                      strokeWidth={1}
                                      variant="geometric"
                                      filled={false}
                                    />
                                  )}
                                </div>
                              </div>

                              {/* Color swatches */}
                              <div className="flex items-center gap-1.5 mt-3">
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: template.colors.primary }}
                                  title="Primario"
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: template.colors.secondary }}
                                  title="Secundario"
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: template.colors.background }}
                                  title="Fondo"
                                />
                                <div
                                  className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: template.colors.text }}
                                  title="Texto"
                                />
                                {template.colors.accent && (
                                  <div
                                    className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: template.colors.accent }}
                                    title="Acento"
                                  />
                                )}
                                <span className="text-xs text-gray-400 ml-2">{desc.floralDesc}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preview of selected template */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-[#2D5016]">Paleta de colores seleccionada</h4>
                        <p className="text-sm text-gray-500">
                          Plantilla: {invitationTemplates[displayData.templateId]?.name || "Clasica"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {Object.entries(getTemplateColors(displayData.templateId, displayData.customColors)).map(
                        ([name, color]) => {
                          const colorNames: Record<string, string> = {
                            primary: "Principal",
                            secondary: "Secundario",
                            background: "Fondo",
                            text: "Texto",
                            accent: "Acento"
                          };
                          return (
                            <div key={name} className="text-center">
                              <div
                                className="w-full h-16 rounded-xl border shadow-sm mb-2"
                                style={{ backgroundColor: color }}
                              />
                              <p className="text-sm font-medium text-gray-700">{colorNames[name] || name}</p>
                              <p className="text-xs text-gray-400 font-mono">{color}</p>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Floral style preview */}
                    {(() => {
                      const selectedColors = getTemplateColors(displayData.templateId, displayData.customColors);
                      const selectedFloralConfig = getTemplateFloralConfig(displayData.templateId);
                      const accentColor = (selectedColors as { accent?: string }).accent || selectedColors.secondary;
                      return (
                        <div className="mt-6 p-4 rounded-xl bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-700">Estilo floral</h5>
                              <p className="text-sm text-gray-500">
                                {selectedFloralConfig.floralStyle === "rose" && "Rosas clasicas elegantes"}
                                {selectedFloralConfig.floralStyle === "wildflower" && "Flores silvestres variadas"}
                                {selectedFloralConfig.floralStyle === "minimal" && "Diseno geometrico minimalista"}
                              </p>
                            </div>
                            <div className="w-20">
                              <FloralDivider
                                floralStyle={selectedFloralConfig.floralStyle}
                                variant="simple"
                                primaryColor={selectedColors.secondary}
                                secondaryColor={selectedColors.primary}
                                accentColor={accentColor}
                                width={80}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-0">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Asi se vera tu invitacion para los invitados
                  </p>
                </div>
                <div className="border rounded-xl overflow-hidden max-h-[600px] overflow-y-auto">
                  <InvitationPreview
                    invitation={displayData}
                    showWatermark={!invitation.isPaid}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Stats */}
          {invitation.isPublished && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-medium text-lg text-[#2D5016] mb-4">
                Estadisticas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-[#4A7C59]">
                    {invitation.viewCount}
                  </p>
                  <p className="text-sm text-gray-600">Visitas</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-[#4A7C59]">
                    {invitation.rsvps?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Confirmaciones</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {invitation.rsvps?.filter((r: RsvpData) => r.willAttend).length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Confirmados</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {invitation.rsvps
                      ?.filter((r: RsvpData) => r.willAttend)
                      .reduce((sum: number, r: RsvpData) => sum + r.numberOfGuests, 0) || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Invitados</p>
                </div>
              </div>

              {/* Lista de Confirmaciones */}
              {invitation.rsvps && invitation.rsvps.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Respuestas Recibidas</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {invitation.rsvps.map((rsvp: RsvpData) => (
                      <div
                        key={rsvp._id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          rsvp.willAttend ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{rsvp.guestName}</p>
                          <p className="text-sm text-gray-600">
                            {rsvp.willAttend
                              ? `Asistira con ${rsvp.numberOfGuests} persona(s)`
                              : "No asistira"}
                          </p>
                          {rsvp.message && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              &quot;{rsvp.message}&quot;
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            rsvp.willAttend ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {rsvp.willAttend ? "Confirmado" : "Declinado"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invitationId={invitation._id}
      />
    </>
  );
}
