//: Libraries

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

//: Component
import NoteListPage from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";

// Type

type Props = {
  params: Promise<{ currentPage: number; perPage: number; searchText: string }>;
};

const NotesPage = async ({ params }: Props) => {
  const { currentPage, perPage, searchText } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, perPage, searchText],
    queryFn: () => fetchNotes(currentPage, perPage, searchText),
  });

  console.log(typeof currentPage);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteListPage />
    </HydrationBoundary>
  );
};

export default NotesPage;
