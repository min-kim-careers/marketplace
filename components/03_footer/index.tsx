import { META } from "@/lib/constants/meta";

export default function Footer() {
  return (
    <div className='flex flex-col items-start text-xs gap-2'>
      <div>
        <p>{META.APP_TITLE}</p>
      </div>
      <div>
        <p>
          All trademarks are owned by their respective
          owners.
        </p>
        <p>
          {META.APP_TITLE} is an independent community website
          which has no association with nor endorsement by
          the respective trademark owners.
        </p>
      </div>
      <div>
        Copyright © 2025-2025 {META.APP_TITLE} ABN: 00 000 000
        000
      </div>
    </div>
  )
}
