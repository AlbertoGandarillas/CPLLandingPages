import React, { useEffect, useState } from "react";
import { evidenceNotesApi } from "@/services/evidenceNotes";
import { ViewCPLEvidenceCompetencyNotes } from "@prisma/client";

interface EvidenceNotesProps {
  title: string;
  evidence: string;
}

export function EvidenceNotes({ title, evidence }: EvidenceNotesProps) {
  const [notes, setNotes] = useState<ViewCPLEvidenceCompetencyNotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const response = await evidenceNotesApi.getByTitle(title, evidence);
        setNotes(response || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (evidence && title) {
      fetchNotes();
    }
  }, [evidence, title]);


  if (notes.length === 0) {
    return <p className="text-sm text-gray-500">No notes found</p>;
  }

  return (
    <div className="max-w-sm">
      <h2 className="mb-2 font-bold">Public Notes</h2>
      {notes.map((note, index) => (
        <p key={index} className="text-sm">
          {note.Notes}
        </p>
      ))}
    </div>
  );
}
