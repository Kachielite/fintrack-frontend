import React from "react";

interface EmptyStateProps {
  message: string;
  action?: { label: string; onPress: () => void };
}

export default function EmptyState(_props: EmptyStateProps): null {
  return null;
}
