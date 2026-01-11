/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiEventAssistant from "../aiEventAssistant.js";
import type * as aiShoppingLists from "../aiShoppingLists.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as dishIngredients from "../dishIngredients.js";
import type * as drinkInventory from "../drinkInventory.js";
import type * as eventTasks from "../eventTasks.js";
import type * as gallery from "../gallery.js";
import type * as generatedQuotes from "../generatedQuotes.js";
import type * as guestPortal from "../guestPortal.js";
import type * as ingredients from "../ingredients.js";
import type * as meetings from "../meetings.js";
import type * as quoteTemplates from "../quoteTemplates.js";
import type * as quotes from "../quotes.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as seedWedding50Template from "../seedWedding50Template.js";
import type * as seedWeddingTemplate from "../seedWeddingTemplate.js";
import type * as shoppingLists from "../shoppingLists.js";
import type * as spaces from "../spaces.js";
import type * as staff from "../staff.js";
import type * as staffAssignments from "../staffAssignments.js";
import type * as tables from "../tables.js";
import type * as testimonials from "../testimonials.js";
import type * as updateTablesToFifteen from "../updateTablesToFifteen.js";
import type * as updateWedding50Services from "../updateWedding50Services.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiEventAssistant: typeof aiEventAssistant;
  aiShoppingLists: typeof aiShoppingLists;
  analytics: typeof analytics;
  auth: typeof auth;
  bookings: typeof bookings;
  dishIngredients: typeof dishIngredients;
  drinkInventory: typeof drinkInventory;
  eventTasks: typeof eventTasks;
  gallery: typeof gallery;
  generatedQuotes: typeof generatedQuotes;
  guestPortal: typeof guestPortal;
  ingredients: typeof ingredients;
  meetings: typeof meetings;
  quoteTemplates: typeof quoteTemplates;
  quotes: typeof quotes;
  resources: typeof resources;
  seed: typeof seed;
  seedWedding50Template: typeof seedWedding50Template;
  seedWeddingTemplate: typeof seedWeddingTemplate;
  shoppingLists: typeof shoppingLists;
  spaces: typeof spaces;
  staff: typeof staff;
  staffAssignments: typeof staffAssignments;
  tables: typeof tables;
  testimonials: typeof testimonials;
  updateTablesToFifteen: typeof updateTablesToFifteen;
  updateWedding50Services: typeof updateWedding50Services;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
