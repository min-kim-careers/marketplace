import { useRouter as useNextRouter } from 'next/navigation'

const useCustomRouter = () => {
  const { push: nextPush, ...rest } = useNextRouter()

  const customPush = ({
    pathname,
    query,
  }: {
    pathname: string
    query: Record<string, string>
  }) => {
    const generateQuery = new URLSearchParams(
      query,
    ).toString()

    nextPush(`${pathname}?${generateQuery}`)
  }

  return { ...rest, push: customPush }
}

export default useCustomRouter
