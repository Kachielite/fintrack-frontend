/**
 * Lightweight SSE client for React Native using XHR (fetch doesn't support streaming in RN).
 * Parses the standard SSE wire format: "event: name\ndata: json\n\n"
 */
export interface SSEHandlers {
  onEvent: (name: string, data: unknown) => void;
  onError?: (status: number) => void;
  onClose?: () => void;
}

export function openSSE(url: string, token: string, handlers: SSEHandlers): () => void {
  const xhr = new XMLHttpRequest();
  let cursor = 0;

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  xhr.setRequestHeader("Accept", "text/event-stream");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  const processChunk = () => {
    const text = xhr.responseText;
    if (text.length <= cursor) return;
    const chunk = text.slice(cursor);
    cursor = text.length;

    // SSE blocks are separated by double newlines
    const blocks = chunk.split("\n\n");
    for (const block of blocks) {
      if (!block.trim()) continue;
      let eventName = "message";
      let dataLine = "";
      for (const line of block.split("\n")) {
        if (line.startsWith("event: ")) eventName = line.slice(7).trim();
        else if (line.startsWith("data: ")) dataLine = line.slice(6);
      }
      if (!dataLine) continue;
      try {
        handlers.onEvent(eventName, JSON.parse(dataLine));
      } catch {
        handlers.onEvent(eventName, dataLine);
      }
    }
  };

  xhr.onreadystatechange = () => {
    if (
      xhr.readyState === XMLHttpRequest.LOADING ||
      xhr.readyState === XMLHttpRequest.DONE
    ) {
      processChunk();
    }
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status !== 200) {
        handlers.onError?.(xhr.status);
      } else {
        handlers.onClose?.();
      }
    }
  };

  xhr.onerror = () => handlers.onError?.(-1);
  xhr.send();

  return () => xhr.abort();
}
