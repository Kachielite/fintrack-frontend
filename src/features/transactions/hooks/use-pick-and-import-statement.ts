import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { useImportStatementFile } from "./use-create-transaction";
import { ImportTarget } from "../transactions.dto";

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

// Split into pickFile() + confirmImport() (rather than one combined action)
// so a caller can insert a step in between — e.g. ImportCsvSheet's
// account-selection picker. A caller that doesn't need that (onboarding) can
// just call both back to back.
//
// `onAccepted` fires once the upload is accepted (queued for background
// processing) — not once the import actually finishes. The real result
// arrives later as an import_complete/import_failed notification.
export function usePickAndImportStatement(onAccepted?: () => void) {
  const { importStatementFile, isImporting } = useImportStatementFile();

  const [fileName, setFileName] = useState<string | null>(null);
  const [pickedAsset, setPickedAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFileName(null);
    setPickedAsset(null);
    setAccepted(false);
    setError(null);
  }

  async function pickFile(): Promise<boolean> {
    setAccepted(false);
    setError(null);
    const picked = await DocumentPicker.getDocumentAsync({
      type: SUPPORTED_MIME_TYPES,
      copyToCacheDirectory: true,
    });
    if (picked.canceled || !picked.assets[0]) return false;

    const asset = picked.assets[0];
    setFileName(asset.name);
    setPickedAsset(asset);
    return true;
  }

  async function confirmImport(target?: ImportTarget) {
    if (!pickedAsset) return;
    try {
      await importStatementFile({
        file: {
          uri: pickedAsset.uri,
          name: pickedAsset.name,
          mimeType: pickedAsset.mimeType,
        },
        target,
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

  return {
    pickFile,
    confirmImport,
    isImporting,
    fileName,
    hasPickedFile: !!pickedAsset,
    accepted,
    error,
    reset,
  };
}
