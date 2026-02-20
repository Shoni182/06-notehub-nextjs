//?   SSR server side rendering - default mode
//
//: Libraries
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

//: Component
import NoteListPage from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";

// : Server prefetch
const NotesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    // На серверній частині ключі записуються обєктами задля вдомності,
    // так як вони повинні співпадати з Кількістю ключів в клієнському компоненті
    queryKey: ["notes", { page: 0, limit: 0, search: "" }],
    queryFn: () => fetchNotes(0, 0, ""),
  });

  // : Return and dehydratation a
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteListPage />
    </HydrationBoundary>
  );
};

export default NotesPage;

// notes={data.notes}
