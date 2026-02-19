// imports
import axios from "axios";

// interface
import { type Note } from "./note";
import { type NewNote } from "./note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Key
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export const fetchNotes = async (
  page: number,
  perPage: number,
  searchText: string,
) => {
  const res = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: searchText,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });

  return res.data;
};

export const fetchNoteById = async (noteId: string) => {
  const res = await axios.get<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};

export const createNote = async (taskData: NewNote) => {
  const res = await axios.post<Note>("/notes", taskData, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};

export const deleteNote = async (taskId: string) => {
  const res = await axios.delete<Note>(`/notes/${taskId}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
};
