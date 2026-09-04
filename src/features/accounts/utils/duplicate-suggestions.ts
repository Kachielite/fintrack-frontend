import { Account } from "../accounts.interface";

const MIN_SUFFIX_LENGTH = 3;
const SUFFIX_COMPARISON_LENGTH = 4;

export interface DuplicateAccountSuggestion {
  target: Account;
  source: Account;
}

// The trailing contiguous run of digits, not every visible digit, then
// normalized to a fixed length. Different banks mask differently - some show
// only a suffix ("XXXXXX4437"), Access Bank sometimes also shows a visible
// prefix for the same real account depending on which sync produced the mask
// ("180******406" one time, "******406" another). Concatenating every
// visible digit (180406 vs 406) misses that real match; comparing a
// normalized trailing suffix (406 vs 406) catches it. Confirmed against real
// merge history - see fintrack-frontend#78.
function suffixKey(mask: string | null): string | null {
  if (!mask) return null;
  const trailingDigits = mask.match(/(\d+)$/)?.[1];
  if (!trailingDigits || trailingDigits.length < MIN_SUFFIX_LENGTH) return null;
  return trailingDigits.slice(-SUFFIX_COMPARISON_LENGTH);
}

/**
 * Finds active accounts that likely represent the same real bank account -
 * same currency, same trailing account-number digits - so the Accounts
 * screen can suggest merging them instead of the user having to notice on
 * their own. Only compares active accounts; already-deactivated ones are
 * already resolved.
 */
export function findDuplicateAccountSuggestions(
  accounts: Account[],
): DuplicateAccountSuggestion[] {
  const groups = new Map<string, Account[]>();

  for (const account of accounts) {
    if (!account.isActive) continue;
    const key = suffixKey(account.accountNumberMask);
    if (!key) continue;
    const groupKey = `${account.currency}:${key}`;
    const group = groups.get(groupKey);
    if (group) group.push(account);
    else groups.set(groupKey, [account]);
  }

  const suggestions: DuplicateAccountSuggestion[] = [];
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    // Earlier-created account survives as the merge target, matching the
    // pattern already observed in real merge history.
    const sorted = [...group].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime() || a.id - b.id,
    );
    const [target, ...sources] = sorted;
    for (const source of sources) {
      suggestions.push({ target, source });
    }
  }

  return suggestions;
}

export function suggestionKey(suggestion: DuplicateAccountSuggestion): string {
  return `${suggestion.target.id}-${suggestion.source.id}`;
}
