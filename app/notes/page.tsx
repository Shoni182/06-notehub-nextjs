//: Libraries
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { toast, Toaster } from "react-hot-toast";

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

//: Components
import css from "./App.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

// const Note = async () => {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["notes"],
//   });
// };

export default function App() {
  const perPage = 12;
  // const [id, setId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const debaucedSetSearchText = useDebouncedCallback(setSearchText, 300);

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    debaucedSetSearchText(value);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", currentPage, perPage, searchText],
    queryFn: () => fetchNotes(currentPage, perPage, searchText),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox text={searchText} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal close={closeModal}>
            <NoteForm close={closeModal} />
          </Modal>
        )}
      </header>
      {/* {isLoading && <strong>Завантаження</strong>} */}
      {/* {isError && toast.error("Щось пішло не так!")} */}
      {/* <Toaster /> */}
      {data?.notes && <NoteList notes={data.notes} />}
    </div>
  );
}

const Notes = async () => {
  const response = await fetchNotes();
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox text={searchText} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal close={closeModal}>
            <NoteForm close={closeModal} />
          </Modal>
        )}
      </header>
      {/* {isLoading && <strong>Завантаження</strong>} */}
      {/* {isError && toast.error("Щось пішло не так!")} */}
      {/* <Toaster /> */}
      {data?.notes && <NoteList notes={data.notes} />}
    </div>
  );
};
