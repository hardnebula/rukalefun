import type { FloralStyle, FloralDensity } from "../decorations";

export interface InvitationTemplate {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  floralStyle: FloralStyle;
  floralDensity: FloralDensity;
}

export const invitationTemplates: Record<string, InvitationTemplate> = {
  classic: {
    id: "classic",
    name: "Clasica",
    colors: {
      primary: "#4A7C59", // verde teal
      secondary: "#E8C4C4", // rosa suave
      background: "#F8F4ED", // crema/beige
      text: "#2D5016", // verde oscuro
      accent: "#D4A574", // dorado suave
    },
    floralStyle: "rose",
    floralDensity: "medium",
  },
  romantic: {
    id: "romantic",
    name: "Romantica",
    colors: {
      primary: "#9F7E69", // rosa dusty
      secondary: "#E8D4C4", // beige rosado
      background: "#FFF5F5", // rosa muy claro
      text: "#5C4033", // marron
      accent: "#C9A89A", // rosa antiguo
    },
    floralStyle: "wildflower",
    floralDensity: "dense",
  },
  modern: {
    id: "modern",
    name: "Moderna",
    colors: {
      primary: "#2D3748", // gris oscuro
      secondary: "#E2B659", // dorado
      background: "#FAFAFA", // blanco humo
      text: "#1A202C", // casi negro
      accent: "#4A5568", // gris medio
    },
    floralStyle: "minimal",
    floralDensity: "sparse",
  },
};

export function getTemplateColors(
  templateId: string,
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  }
) {
  if (customColors) {
    return customColors;
  }
  return invitationTemplates[templateId]?.colors || invitationTemplates.classic.colors;
}

export function getTemplateFloralConfig(templateId: string) {
  const template = invitationTemplates[templateId] || invitationTemplates.classic;
  return {
    floralStyle: template.floralStyle,
    floralDensity: template.floralDensity,
  };
}

export function getFullTemplateConfig(templateId: string) {
  return invitationTemplates[templateId] || invitationTemplates.classic;
}
