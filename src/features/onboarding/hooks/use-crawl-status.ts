import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EmailConnectionService } from "@/features/email-connection/email-connection.service";
import { openSSE } from "@/core/common/network/sse-client";
import { ENV } from "@/core/common/constants/env";
import { STORAGE_KEYS } from "@/core/common/constants/storage-keys";

export type CrawlPhase = "loading" | "connecting" | "searching" | "syncing" | "done" | "skipped" | "error";

export interface CrawlStatus {
  phase: CrawlPhase;
  statusMessage: string;
  transactionCount: number;
  progress: { processed: number; total: number };
}

export function useCrawlStatus(): CrawlStatus {
  const [phase, setPhase] = useState<CrawlPhase>("loading");
  const [statusMessage, setStatusMessage] = useState("Connecting to Gmail…");
  const [transactionCount, setTransactionCount] = useState(0);
  const [progress, setProgress] = useState({ processed: 0, total: 0 });
  const closeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const connections = await EmailConnectionService.listConnections();
        const connection = connections.find((c) => c.gmailLabelId !== null);

        if (!connection || cancelled) {
          setPhase("skipped");
          return;
        }

        // Read from AsyncStorage to guarantee a fresh token even if Zustand is stale
        // (apiClient auto-refreshes tokens but only updates AsyncStorage, not the store)
        const freshToken = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
        if (!freshToken || cancelled) {
          setPhase("error");
          setStatusMessage("Session expired. Please sign in again.");
          return;
        }

        const url = `${ENV.API_BASE_URL}/email-connections/${connection.id}/sync-stream`;

        closeRef.current = openSSE(url, freshToken, {
          onEvent: (name, data) => {
            if (cancelled) return;
            const d = data as Record<string, unknown>;
            if (name === "connecting") {
              setPhase("connecting");
              setStatusMessage("Connecting to Gmail…");
            } else if (name === "searching") {
              setPhase("searching");
              const label = (d.labelName as string) ?? "Bank Transactions";
              setStatusMessage(`Searching for "${label}" label…`);
            } else if (name === "start") {
              const total = (d.total as number) ?? 0;
              setProgress({ processed: 0, total });
              setPhase("syncing");
              setStatusMessage(
                total > 0
                  ? `Found ${total} transaction email${total !== 1 ? "s" : ""}…`
                  : "No new emails found in label"
              );
            } else if (name === "progress") {
              const processed = (d.processed as number) ?? 0;
              const total = (d.total as number) ?? 0;
              setProgress({ processed, total });
              setPhase("syncing");
              setStatusMessage(`Reading email ${processed} of ${total}…`);
            } else if (name === "done") {
              const added = (d.added as number) ?? 0;
              setTransactionCount(added);
              setStatusMessage(
                added > 0
                  ? `Found ${added} new transaction${added !== 1 ? "s" : ""}!`
                  : "Your data is up to date"
              );
              setPhase("done");
            } else if (name === "error") {
              setPhase("error");
              setStatusMessage("Something went wrong. Please try again.");
            }
          },
          onError: () => {
            if (!cancelled) {
              setPhase("error");
              setStatusMessage("Connection lost. Please try again.");
            }
          },
          onClose: () => {
            if (!cancelled && phase !== "done") setPhase("done");
          },
        });
      } catch {
        if (!cancelled) setPhase("skipped");
      }
    };

    run();

    return () => {
      cancelled = true;
      closeRef.current?.();
    };
  }, []);

  return { phase, statusMessage, transactionCount, progress };
}
