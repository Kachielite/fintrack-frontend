import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import Toast from "react-native-toast-message";
import { useImportTransactionsCsv } from "./use-create-transaction";
import { ImportCsvResultDto } from "../transactions.dto";

export function usePickAndImportCsv(
  onImported?: (result: ImportCsvResultDto) => void,
) {
  const { importCsv, isImporting } = useImportTransactionsCsv();

  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportCsvResultDto | null>(null);

  function reset() {
    setFileName(null);
    setResult(null);
  }

  async function pickAndImport() {
    setResult(null);
    const picked = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/comma-separated-values", "*/*"],
      copyToCacheDirectory: true,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    setFileName(asset.name);

    let content: string;
    try {
      content = await new File(asset.uri).text();
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not read that file. Try a different CSV.",
      });
      return;
    }

    try {
      const outcome = await importCsv(content);
      setResult(outcome);
      if (outcome.imported > 0) {
        Toast.show({
          type: "success",
          text1: `Imported ${outcome.imported} transaction${outcome.imported === 1 ? "" : "s"}`,
        });
        onImported?.(outcome);
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not import this CSV. Try a different file.";
      Toast.show({ type: "error", text1: message });
    }
  }

  return { pickAndImport, isImporting, fileName, result, reset };
}
