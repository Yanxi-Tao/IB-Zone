import { FormAlertProps } from '@/lib/types'
import { CircleAlert, CircleCheck } from 'lucide-react'

export const FormAlert = ({ alert }: { alert: FormAlertProps }) => {
  if (!alert || !alert.message || !alert.type) return null
  const { message, type } = alert

  return (
    <>
      {type === 'success' ? (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-emerald-500">
          <CircleCheck size={20} />
          <p>{message}</p>
        </div>
      ) : (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive">
          <CircleAlert size={20} />
          <p>{message}</p>
        </div>
      )}
    </>
  )
}
