import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import Dropdown from "@/core/common/components/Dropdown";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { ImportTarget } from "../transactions.dto";
import NewAccountFields, { NewAccountFieldsValue } from "@/features/accounts/components/new-account-fields";

const CREATE_NEW = "__create_new__";

const EMPTY_NEW_ACCOUNT: NewAccountFieldsValue = {
  bankName: "",
  accountNumber: "",
  currency: null,
};

interface Props {
  onChange: (target: ImportTarget | undefined) => void;
}

/**
 * Lets the user pick which account a statement is being imported into (or
 * create a new one) instead of silently falling back to their app-wide
 * reference currency. The AI reading the statement needs to know the target
 * account since the statement itself may not carry enough information
 * (e.g. no currency column) to figure it out.
 */
export default function ImportAccountPicker({ onChange }: Props) {
  const colors = useThemeColors();
  const { accounts, isLoading } = useAccounts();
  const activeAccounts = accounts.filter((a) => a.isActive);
  const [selected, setSelected] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<NewAccountFieldsValue>(EMPTY_NEW_ACCOUNT);

  // Default straight into "create new" when there's nothing to pick from yet.
  useEffect(() => {
    if (!isLoading && activeAccounts.length === 0 && selected === null) {
      setSelected(CREATE_NEW);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, activeAccounts.length]);

  function handleSelect(optionValue: string) {
    setSelected(optionValue);
    if (optionValue === CREATE_NEW) {
      onChange(newAccount.currency ? toTarget(newAccount) : undefined);
    } else {
      onChange({ accountId: Number(optionValue) });
    }
  }

  function handleNewAccountChange(next: NewAccountFieldsValue) {
    setNewAccount(next);
    onChange(next.currency ? toTarget(next) : undefined);
  }

  function toTarget(fields: NewAccountFieldsValue): ImportTarget {
    return {
      currency: fields.currency ?? undefined,
      bankId: fields.bankId,
      accountNumber: fields.accountNumber.trim() || undefined,
    };
  }

  const options = [
    ...activeAccounts.map((account) => ({
      value: String(account.id),
      label: account.label,
      sub: [account.currency, account.bankName].filter(Boolean).join(". "),
    })),
    { value: CREATE_NEW, label: "Create a new account" },
  ];

  if (isLoading) {
    return <ActivityIndicator color={colors.primary} />;
  }

  return (
    <View style={{ gap: SPACING.sm }}>
      <Dropdown
        label="IMPORT INTO"
        placeholder="Select an account"
        value={selected}
        options={options}
        onSelect={handleSelect}
      />

      {selected === CREATE_NEW && (
        <NewAccountFields value={newAccount} onChange={handleNewAccountChange} />
      )}
    </View>
  );
}
