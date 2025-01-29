import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'

export default function Footer() {
  return (
    <footer className='flex w-full flex-col items-start text-sm'>
      <CardHeader>
        <CardTitle>Marketplace</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          All trademarks are owned by their respective
          owners.
        </p>
        <p>
          Marketplace is an independent community website
          which has no association with nor endorsement by
          the respective trademark owners.
        </p>
      </CardContent>
      <CardFooter>
        Copyright © 2025-2025 Marketplace ABN: 00 000 000
        000
      </CardFooter>
    </footer>
  )
}
