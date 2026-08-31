import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { useImportStatementFile } from "./use-create-transaction";

// Must match the backend's actually-supported formats exactly (see the backend
// ticket's PR) — not the broader CSV/PDF/XLSX/XLS/DOCX/DOC set originally assumed,
// since legacy .xls/.doc were scoped out of v1 there. Offering them here would
// just walk the user into a guaranteed rejection after picking.
const SUPPORTED_MIME_TYPES = [
  "text/csv",
  "text/comma-separated-values",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

// `onAccepted` fires once the upload is accepted (queued for background
// processing) — not once the import actually finishes. The real result
// arrives later as an import_complete/import_failed notification.
export function usePickAndImportStatement(onAccepted?: () => void) {
  const { importStatementFile, isImporting } = useImportStatementFile();

  const [fileName, setFileName] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFileName(null);
    setAccepted(false);
    setError(null);
  }

  async function pickAndImport() {
    setAccepted(false);
    setError(null);
    const picked = await DocumentPicker.getDocumentAsync({
      type: SUPPORTED_MIME_TYPES,
      copyToCacheDirectory: true,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    setFileName(asset.name);

    try {
      await importStatementFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });
      setAccepted(true);
      Toast.show({
        type: "success",
        text1: "Import started",
        text2: "We'll notify you when it's done.",
      });
      onAccepted?.();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not import this file. Try a different statement.";
      setError(message);
      Toast.show({ type: "error", text1: message });
    }
  }

  return { pickAndImport, isImporting, fileName, accepted, error, reset };
}
