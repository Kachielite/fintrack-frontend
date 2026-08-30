// A small formatting utility, not encryption — just enough to keep an email
// off-screen by default while still being recognizable as "yours" at a glance.
// e.g. "derrick@gmail.com" -> "de••••k@g•••.com"
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const maskedLocal = local.length <= 2
    ? `${local[0]}${"•".repeat(Math.max(local.length - 1, 1))}`
    : `${local.slice(0, 2)}••••${local.slice(-1)}`;

  const [domainName, ...domainRestParts] = domain.split(".");
  const domainRest = domainRestParts.join(".");
  const maskedDomainName = domainName.length <= 1 ? domainName : `${domainName[0]}•••`;

  return `${maskedLocal}@${maskedDomainName}${domainRest ? `.${domainRest}` : ""}`;
}
