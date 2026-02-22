//?   SSR server side rendering - default mode
//
//: Libraries
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

//: Component

import NoteListPage from "@/app/notes/Notes.client";
import { fetchNotes } from "@/lib/api";

// : Server prefetch
const NotesPage = async () => {
  const queryClient = new QueryClient();

  const params = { page: 1, perPage: 12, searchInput: "" };

  await queryClient.prefetchQuery({
    // На серверній частині ключі записуються обєктами задля вдомності,
    // так як вони повинні співпадати з Кількістю ключів в клієнському компоненті
    queryKey: ["notes", params],
    queryFn: () => fetchNotes(params),
  });

  // : Return and dehydratation
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteListPage initialValues={params} />
    </HydrationBoundary>
  );
};

export default NotesPage;
