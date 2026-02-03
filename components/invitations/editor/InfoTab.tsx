"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Gift } from "lucide-react";
import SaveStatusIndicator, { SaveStatus } from "./SaveStatusIndicator";

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

interface InfoTabProps {
  data: InvitationData;
  onChange: (field: keyof InvitationData, value: string | boolean | GiftLink[] | undefined) => void;
  saveStatus: SaveStatus;
}

export default function InfoTab({
  data,
  onChange,
  saveStatus,
}: InfoTabProps) {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");

  const handleChange = (
    field: keyof InvitationData,
    value: string | boolean | GiftLink[] | undefined
  ) => {
    onChange(field, value);
  };

  const handleAddGiftLink = () => {
    if (!newLinkName.trim()) return;

    const currentLinks = data.giftRegistryLinks || [];
    const newLinks = [
      ...currentLinks,
      {
        name: newLinkName.trim(),
        url: newLinkUrl.trim() || undefined,
        description: newLinkDescription.trim() || undefined,
      },
    ];

    handleChange("giftRegistryLinks", newLinks);
    setNewLinkName("");
    setNewLinkUrl("");
    setNewLinkDescription("");
  };

  const handleRemoveGiftLink = (index: number) => {
    const currentLinks = data.giftRegistryLinks || [];
    const newLinks = currentLinks.filter((_, i) => i !== index);
    handleChange("giftRegistryLinks", newLinks.length > 0 ? newLinks : undefined);
  };

  return (
    <div className="space-y-8">
      {/* Save Status Indicator */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-3 border-b flex justify-end">
        <SaveStatusIndicator status={saveStatus} />
      </div>

      {/* Section: Names */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Informacion de la Pareja
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Nombre 1</Label>
            <Input
              value={data.person1Name}
              onChange={(e) => handleChange("person1Name", e.target.value)}
            />
          </div>
          <div>
            <Label>Nombre 2</Label>
            <Input
              value={data.person2Name}
              onChange={(e) => handleChange("person2Name", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section: Welcome */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Pantalla de Bienvenida
        </h3>
        <div>
          <Label>Texto de Bienvenida (opcional)</Label>
          <Input
            value={data.welcomeText || ""}
            onChange={(e) => handleChange("welcomeText", e.target.value || undefined)}
            placeholder="Ej: Te invitamos a nuestro matrimonio"
          />
        </div>
      </div>

      {/* Section: Quote */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Frase de Amor (opcional)
        </h3>
        <div>
          <Label>Frase</Label>
          <Textarea
            value={data.loveQuote || ""}
            onChange={(e) => handleChange("loveQuote", e.target.value || undefined)}
            placeholder="Una frase especial para ustedes..."
            rows={3}
          />
        </div>
        <div>
          <Label>Autor</Label>
          <Input
            value={data.loveQuoteAuthor || ""}
            onChange={(e) => handleChange("loveQuoteAuthor", e.target.value || undefined)}
            placeholder="Ej: Pablo Neruda"
          />
        </div>
      </div>

      {/* Section: Ceremony */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Ceremonia
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={data.ceremonyDate}
              onChange={(e) => handleChange("ceremonyDate", e.target.value)}
            />
          </div>
          <div>
            <Label>Hora</Label>
            <Input
              type="time"
              value={data.ceremonyTime}
              onChange={(e) => handleChange("ceremonyTime", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Lugar</Label>
          <Input
            value={data.ceremonyLocation}
            onChange={(e) => handleChange("ceremonyLocation", e.target.value)}
            placeholder="Ej: Iglesia San Jose"
          />
        </div>
        <div>
          <Label>Direccion</Label>
          <Input
            value={data.ceremonyAddress}
            onChange={(e) => handleChange("ceremonyAddress", e.target.value)}
            placeholder="Ej: Av. Principal 123, Villarrica"
          />
        </div>
        <div>
          <Label>Link de Google Maps (opcional)</Label>
          <Input
            value={data.ceremonyMapsUrl || ""}
            onChange={(e) => handleChange("ceremonyMapsUrl", e.target.value || undefined)}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* Section: Celebration */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Celebracion
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Fecha (si es diferente)</Label>
            <Input
              type="date"
              value={data.celebrationDate || ""}
              onChange={(e) => handleChange("celebrationDate", e.target.value || undefined)}
            />
          </div>
          <div>
            <Label>Hora</Label>
            <Input
              type="time"
              value={data.celebrationTime || ""}
              onChange={(e) => handleChange("celebrationTime", e.target.value || undefined)}
            />
          </div>
        </div>
        <div>
          <Label>Lugar</Label>
          <Input
            value={data.celebrationLocation || ""}
            onChange={(e) => handleChange("celebrationLocation", e.target.value || undefined)}
            placeholder="Ej: Ruka Lefun"
          />
        </div>
        <div>
          <Label>Direccion</Label>
          <Input
            value={data.celebrationAddress || ""}
            onChange={(e) => handleChange("celebrationAddress", e.target.value || undefined)}
            placeholder="Ej: Camino a Pucon Km 5, Villarrica"
          />
        </div>
        <div>
          <Label>Link de Google Maps (opcional)</Label>
          <Input
            value={data.celebrationMapsUrl || ""}
            onChange={(e) => handleChange("celebrationMapsUrl", e.target.value || undefined)}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* Section: Party */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Informacion de la Fiesta
        </h3>
        <div>
          <Label>Dress Code</Label>
          <Input
            value={data.dressCode || ""}
            onChange={(e) => handleChange("dressCode", e.target.value || undefined)}
            placeholder="Ej: Formal elegante"
          />
        </div>
        <div>
          <Label>Descripcion del Dress Code (opcional)</Label>
          <Textarea
            value={data.dressCodeDescription || ""}
            onChange={(e) => handleChange("dressCodeDescription", e.target.value || undefined)}
            placeholder="Ej: Colores pasteles, evitar blanco..."
            rows={2}
          />
        </div>
        <div>
          <Label>Notas Adicionales (Tips)</Label>
          <Textarea
            value={data.additionalNotes || ""}
            onChange={(e) => handleChange("additionalNotes", e.target.value || undefined)}
            placeholder="Ej: El evento sera al aire libre..."
            rows={3}
          />
        </div>
      </div>

      {/* Section: Confirmacion de Asistencia */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2">
          Confirmacion de Asistencia
        </h3>
        <div>
          <Label>Fecha limite para confirmar</Label>
          <Input
            type="date"
            value={data.rsvpDeadline || ""}
            onChange={(e) => handleChange("rsvpDeadline", e.target.value || undefined)}
          />
        </div>
        <div>
          <Label>Mensaje para invitados (opcional)</Label>
          <Textarea
            value={data.rsvpMessage || ""}
            onChange={(e) => handleChange("rsvpMessage", e.target.value || undefined)}
            placeholder="Ej: Por favor confirma tu asistencia para poder organizar todo..."
            rows={2}
          />
        </div>
      </div>

      {/* Section: Lista de Regalos */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg text-[#2D5016] border-b pb-2 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Mesa de Regalos
        </h3>

        {/* Enable toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="text-base">Mostrar Mesa de Regalos</Label>
            <p className="text-sm text-gray-500">
              Permite a tus invitados ver donde pueden hacer regalos
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.giftRegistryEnabled || false}
            onClick={() => handleChange("giftRegistryEnabled", !data.giftRegistryEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.giftRegistryEnabled ? "bg-[#4A7C59]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.giftRegistryEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {data.giftRegistryEnabled && (
          <>
            <div>
              <Label>Titulo de la seccion</Label>
              <Input
                value={data.giftRegistryTitle || ""}
                onChange={(e) => handleChange("giftRegistryTitle", e.target.value || undefined)}
                placeholder="Ej: Mesa de Regalos"
              />
            </div>
            <div>
              <Label>Mensaje (opcional)</Label>
              <Textarea
                value={data.giftRegistryMessage || ""}
                onChange={(e) => handleChange("giftRegistryMessage", e.target.value || undefined)}
                placeholder="Ej: Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo..."
                rows={2}
              />
            </div>

            {/* Current links */}
            {data.giftRegistryLinks && data.giftRegistryLinks.length > 0 && (
              <div className="space-y-2">
                <Label>Links agregados</Label>
                {data.giftRegistryLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                  >
                    <Gift className="w-5 h-5 text-[#4A7C59] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{link.name}</p>
                      {link.url && (
                        <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      )}
                      {link.description && (
                        <p className="text-sm text-gray-400 truncate">{link.description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGiftLink(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new link */}
            <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
              <Label className="text-[#4A7C59]">Agregar nuevo link</Label>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="Nombre (ej: Novios Falabella)"
                />
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL (opcional)"
                />
              </div>
              <Input
                value={newLinkDescription}
                onChange={(e) => setNewLinkDescription(e.target.value)}
                placeholder="Descripcion adicional (opcional, ej: datos de transferencia)"
              />
              <Button
                type="button"
                onClick={handleAddGiftLink}
                disabled={!newLinkName.trim()}
                className="bg-[#4A7C59] hover:bg-[#3d6649] gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </Button>
            </div>

            {/* Suggestions */}
            <div className="text-sm text-gray-500 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-700 mb-1">Sugerencias populares:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Novios Falabella - noviosfalabella.com</li>
                <li>Novios Paris - novios.paris.cl</li>
                <li>Novios Ripley - novios.ripley.cl</li>
                <li>Transferencia bancaria (agrega los datos en descripcion)</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
