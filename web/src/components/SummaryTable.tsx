import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeggining } from "../utils/generate-dates-from-year-beggining";
import { HabitDay } from "./HabitDay";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summayDates = generateDatesFromYearBeggining();

const minimunSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimunSummaryDatesSize - summayDates.length;

export function SummaryTable() {
    type Summary = {
        id: string;
        date: string;
        amount: number;
        completed: number;
    }

    const [summary, setSummary] = useState<Summary[]>([]);

    useEffect(() => {
        api.get('summary').then(response => setSummary(response.data))
    }, [])

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((day, index) => {
                    return (
                        <div
                            key={`${weekDays}-${index}`}
                            className="text-zinc-400 font-bold
                         text-xl h-10 w-10 flex items-center justify-center">
                            {day}
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length > 0 && summayDates.map((date, index) => {
                    const dayInSummary = summary.find(day => {
                        return dayjs(date).isSame(day.date, 'day');
                    })

                    return (
                        <HabitDay
                            key={date.toString()}
                            amount={dayInSummary?.amount}
                            defaultCompleted={dayInSummary?.completed}
                            date={date}
                        />
                    )
                })
                }

                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
                    return (
                        <div key={index} className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
                    )
                })}
            </div>
        </div>
    );
}