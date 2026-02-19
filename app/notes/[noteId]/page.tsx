// Типізація params id сторінки

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
// import { getSing } from "@/lib/api";
import NoteDetails from "./NoteDetails.client";

import { fetchNoteById } from "@/lib/api";

type Props = {
  params: Promise<{ noteId: string }>;
};

const NotePage = async ({ params }: Props) => {
  // Деструктуризація з await тому що це promise
  const { noteId } = await params;
  // Тут має бути prefertch query
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
};

export default NotePage;
