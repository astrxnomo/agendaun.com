import AuthVerify from "@/components/auth/auth-verify"

export default async function CallbackPage(props: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const searchParams = await props.searchParams
  const userId = searchParams.userId ?? ""
  const secret = searchParams.secret ?? ""

  return <AuthVerify userId={userId} secret={secret} />
}
