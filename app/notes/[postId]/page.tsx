import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NoteDetails from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";

// Типізація
type Props = {
  params: Promise<{ noteId: string }>;
};

// Функція
const NotePage = async ({ params }: Props) => {
  // Деструктуризація з await тому що це promise
  const { noteId } = await params;

  // prefertch query
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
