"use client";

import { getTemplateColors, getTemplateFloralConfig } from "./templates";
import WelcomeSection from "./WelcomeSection";
import CountdownSection from "./CountdownSection";
import EventDetailsSection from "./EventDetailsSection";
import GallerySection from "./GallerySection";
import RSVPCallToAction from "./RSVPCallToAction";
import PartySection from "./PartySection";
import GiftRegistrySection from "./GiftRegistrySection";
import { Id } from "@/convex/_generated/dataModel";

interface Photo {
  storageId: string;
  url: string | null;
  caption?: string;
  order: number;
}

interface InvitationData {
  _id: Id<"weddingInvitations">;
  person1Name: string;
  person2Name: string;
  eventDate: string;
  templateId: string;
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
  photos: Photo[];
  dressCode?: string;
  dressCodeDescription?: string;
  additionalNotes?: string;
  rsvpEnabled: boolean;
  rsvpDeadline?: string;
  rsvpMessage?: string;
  giftRegistryEnabled?: boolean;
  giftRegistryTitle?: string;
  giftRegistryMessage?: string;
  giftRegistryLinks?: {
    name: string;
    url?: string;
    description?: string;
  }[];
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

interface InvitationPreviewProps {
  invitation: InvitationData;
  showWatermark?: boolean;
}

export default function InvitationPreview({
  invitation,
  showWatermark = false,
}: InvitationPreviewProps) {
  const colors = getTemplateColors(invitation.templateId, invitation.customColors);
  const { floralStyle } = getTemplateFloralConfig(invitation.templateId);

  return (
    <div className="w-full relative">
      {/* Watermark overlay for unpaid invitations */}
      {showWatermark && (
        <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
          <div className="text-7xl font-bold text-gray-500/20 -rotate-45 select-none whitespace-nowrap">
            VISTA PREVIA
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <WelcomeSection
        person1Name={invitation.person1Name}
        person2Name={invitation.person2Name}
        welcomeText={invitation.welcomeText}
        colors={colors}
        floralStyle={floralStyle}
      />

      {/* Countdown Section */}
      <CountdownSection
        person1Name={invitation.person1Name}
        person2Name={invitation.person2Name}
        eventDate={invitation.eventDate}
        loveQuote={invitation.loveQuote}
        loveQuoteAuthor={invitation.loveQuoteAuthor}
        colors={colors}
        floralStyle={floralStyle}
      />

      {/* Event Details Section */}
      <EventDetailsSection
        ceremonyDate={invitation.ceremonyDate}
        ceremonyTime={invitation.ceremonyTime}
        ceremonyLocation={invitation.ceremonyLocation}
        ceremonyAddress={invitation.ceremonyAddress}
        ceremonyMapsUrl={invitation.ceremonyMapsUrl}
        celebrationDate={invitation.celebrationDate}
        celebrationTime={invitation.celebrationTime}
        celebrationLocation={invitation.celebrationLocation}
        celebrationAddress={invitation.celebrationAddress}
        celebrationMapsUrl={invitation.celebrationMapsUrl}
        colors={colors}
        floralStyle={floralStyle}
      />

      {/* Gallery Section */}
      {invitation.photos && invitation.photos.length > 0 && (
        <GallerySection photos={invitation.photos} colors={colors} floralStyle={floralStyle} />
      )}

      {/* RSVP Call To Action */}
      {invitation.rsvpEnabled && (
        <RSVPCallToAction
          invitationId={invitation._id}
          rsvpMessage={invitation.rsvpMessage}
          rsvpDeadline={invitation.rsvpDeadline}
          colors={colors}
        />
      )}

      {/* Party Section */}
      <PartySection
        invitationId={invitation._id}
        dressCode={invitation.dressCode}
        dressCodeDescription={invitation.dressCodeDescription}
        additionalNotes={invitation.additionalNotes}
        colors={colors}
      />

      {/* Gift Registry Section */}
      {invitation.giftRegistryEnabled && invitation.giftRegistryLinks && invitation.giftRegistryLinks.length > 0 && (
        <GiftRegistrySection
          title={invitation.giftRegistryTitle}
          message={invitation.giftRegistryMessage}
          links={invitation.giftRegistryLinks}
          colors={colors}
        />
      )}


      {/* Footer */}
      <footer
        className="py-8 text-center"
        style={{ backgroundColor: colors.background }}
      >
        <p
          className="text-sm opacity-60"
          style={{ color: colors.text }}
        >
          Hecho con ♡ para {invitation.person1Name} & {invitation.person2Name}
        </p>
      </footer>
    </div>
  );
}
