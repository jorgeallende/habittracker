import * as Checkbox from "@radix-ui/react-checkbox"
import dayjs from "dayjs"
import { Check } from "phosphor-react"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"

interface HabitsListProps {
  date: Date
  onCompletedChange: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string
    title: string
    created_at: string
  }>
  completedHabits: string[]
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>({ possibleHabits: [], completedHabits: [] })

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => {
      setHabitsInfo(response.data)
    })
  }, [])

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted = habitsInfo.completedHabits.includes(habitId);

    await api
      .patch(`/habits/${habitId}/toggle`)
      .then();

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo?.completedHabits.filter(id => id !== habitId);
    } else {
      completedHabits = [...habitsInfo?.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    })

    onCompletedChange(completedHabits.length);
  }

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date())

  return (
    <>
      {habitsInfo?.possibleHabits.length > 0 ? (
        <div className='mt-6 flex flex-col gap-3'>
          {habitsInfo?.possibleHabits.map(habit => {
            console.log(habitsInfo)
            return (
              <Checkbox.Root
                key={habit.id}
                className='flex items-center gap-3 group'
                checked={habitsInfo.completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onCheckedChange={() => handleToggleHabit(habit.id)}
              >
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors'>
                  <Checkbox.Indicator>
                    <Check size={20} className='text-white' />
                  </Checkbox.Indicator>
                </div>
                <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                  {habit.title}
                </span>
              </Checkbox.Root>
            )
          })}
        </div>
      )

        :

        (
          <div className='mt-12 mb-6 flex flex-col gap-3 text-sm text-center text-zinc-400'>
            Você não possui hábitos para esse dia.
          </div>
        )}
    </>
  )
}