import type { getLegacyEvents } from "./actions";

export type LegacyEventsResponse = Awaited<ReturnType<typeof getLegacyEvents>>;
export type LegacyEvent = LegacyEventsResponse["data"][number];

export interface Contributor {
  name: string;
  url: string;
}
