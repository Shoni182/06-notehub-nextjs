//?  USE CLIETN derective for - CSR Client side rendering
//
"use client";
import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
// import { toast, Toaster } from "react-hot-toast";
import css from "@/app/notes/Notes.module.css";

//: Components
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
// import { FetchNotesResponse } from "@/lib/api";

interface InitialValuesProps {
  initialValues: { page: number; perPage: number; searchInput: string };
}

//:  Fn
const NoteListPage = ({ initialValues }: InitialValuesProps) => {
  //: Initial Values
  const { page, perPage, searchInput } = initialValues;
  //: Pages

  const [currentPage, setCurrentPage] = useState(page);

  //: Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //: Search and Debounce
  const [searchText, setSearchText] = useState(searchInput);
  const debaucedSetSearchText = useDebouncedCallback(setSearchText, 300);

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    debaucedSetSearchText(value);
  };

  //: Use Query
  const { data, isSuccess } = useQuery({
    queryKey: ["notes", currentPage, perPage, searchText],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: perPage,
        searchInput: searchText,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages || 0;

  //: Return
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

//: Export of the Fn

export default NoteListPage;
