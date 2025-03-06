export interface VeteranData {
  FirstName: string;
  LastName: string;
  Email: string;
  CollegeID?: number;
  StudentID?: string | null;
  IsValidPdfFormat?: boolean | null;
  CatalogYear?: number;
  StudentPlanNotes?: string;
  PotentialStudent?: boolean;
  CPLSearchUpload?: boolean;
  CPLLandingPage?: boolean;
}

export interface VeteranDocumentData {
  VeteranID: number;
  Filename: string;
  BinaryData: string | ArrayBuffer;
  FileDescription?: string;
  DocumentTypeID?: number;
  user_id?: number;
  Field?: string;
}

export interface CheckVeteranParams {
  firstName?: string;
  lastName?: string;
  collegeId?: number;
  email?: string;
}

export const veteranApi = {
  create: async (data: VeteranData) => {
    const response = await fetch("/api/veterans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create veteran record");
    }

    return response.json();
  },

  uploadDocuments: async (
    veteranId: number,
    documents: VeteranDocumentData[]
  ) => {
    if (!veteranId || isNaN(veteranId)) {
      throw new Error("Invalid veteran ID");
    }

    const results = await Promise.all(
      documents.map(async (doc) => {
        const response = await fetch(`/api/veterans/${veteranId}/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doc),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload document: ${doc.Filename}`);
        }

        return response.json();
      })
    );

    return results;
  },

  createWithDocuments: async (veteranData: VeteranData, documents?: File[]) => {
    // First create the veteran record
    const veteran = await veteranApi.create(veteranData);

    // If there are documents and veteran creation was successful, upload them
    if (documents && documents.length > 0) {
      const documentData = await Promise.all(
        documents.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            Filename: file.name,
            BinaryData: base64,
            FileDescription: file.name,
            DocumentTypeID: 10,
            user_id: 1,
            VeteranID: veteran.id,
            Field: "student_joint_services",
          };
        })
      );

      await veteranApi.uploadDocuments(veteran.id, documentData);
    }

    return veteran;
  },

  checkExisting: async (params: CheckVeteranParams) => {
    const searchParams = new URLSearchParams();
    if (params.firstName) searchParams.set("firstName", params.firstName);
    if (params.lastName) searchParams.set("lastName", params.lastName);
    if (params.collegeId)
      searchParams.set("collegeId", params.collegeId.toString());
    if (params.email) searchParams.set("email", params.email);

    const response = await fetch(
      `/api/veterans/check?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      return { exists: false, veteran: null };
    }

    if (!response.ok) {
      throw new Error("Failed to check veteran");
    }

    const data = await response.json();
    return {
      exists: Boolean(data.veteran),
      veteran: data.veteran,
    };
  },
};

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
