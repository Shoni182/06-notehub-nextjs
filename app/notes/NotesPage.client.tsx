"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";
import { toast, Toaster } from "react-hot-toast";
import css from "@/app/notes/NotesPage.module.css";

//: Components
import { useParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";

const NoteListPage = () => {
  // const { notes } = useParams<{ notes: Note[] }>();
  const perPage = 12;

  //: Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //: Pages
  const [currentPage, setCurrentPage] = useState(1);

  //: Search and Debounce
  const [searchText, setSearchText] = useState("");
  const debaucedSetSearchText = useDebouncedCallback(setSearchText, 300);

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    debaucedSetSearchText(value);
  };

  //
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
      {isLoading && <strong>Завантаження</strong>}
      {isError && toast.error("Щось пішло не так!")}
      {/* <Toaster /> */}
      {data?.notes && <NoteList notes={data.notes} />}
    </div>
  );
};

export default NoteListPage;
