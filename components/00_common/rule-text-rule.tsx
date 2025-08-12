export default function RuleTextRule({ text }: { text: string; }) {
  return (
    <div className='flex items-center'>
      <hr className='flex-grow border-gray-300' />
      <span className='px-4 text-gray-700'>{text}</span>
      <hr className='flex-grow border-gray-300' />
    </div>
  )
}
