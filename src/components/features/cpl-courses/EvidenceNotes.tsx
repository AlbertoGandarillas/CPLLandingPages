import React, { useEffect, useState } from "react";
import { evidenceNotesApi } from "@/services/evidenceNotes";
import { ViewCPLEvidenceCompetencyNotes } from "@prisma/client";

interface EvidenceNotesProps {
  title: string;
  evidence: string;
}

export function EvidenceNotes({ title, evidence }: EvidenceNotesProps) {
  const [notes, setNotes] = useState<ViewCPLEvidenceCompetencyNotes[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await evidenceNotesApi.getByTitle(title, evidence);
        setNotes(response || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      }
    };

    if (evidence) {
      fetchNotes();
    }
  }, [evidence]);

  return (
    <div className="max-w-sm">
      {notes.map((note, index) => (
        <p key={index} className="text-sm">
          {note.Notes}
        </p>
      ))}
    </div>
  );
}
