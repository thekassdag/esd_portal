import type { getPodcasts } from "./actions";

export type PodcastsResponse = Awaited<ReturnType<typeof getPodcasts>>;
export type Podcast = PodcastsResponse["data"][number];
