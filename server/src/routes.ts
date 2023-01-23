import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {

	// create habit
	app.post('/habits', async (request, response) => {
		//title and weekDays
		const createHabitBody = z.object({
			title: z.string(),
			weekDays: z.array(z.number().min(0).max(6))
		});

		const { title, weekDays } = createHabitBody.parse(request.body);

		const today = dayjs().startOf('day').toDate();

		await prisma.habit.create({
			data: {
				title,
				created_at: today,
				weekDays: {
					create: weekDays.map((weekDay) => ({ week_day: weekDay }))
				}
			}
		});
	});

	// get all habits from a day
	app.get('/day', async (request) => {
		const getDayParams = z.object({
			date: z.coerce.date(),
		})

		const { date } = getDayParams.parse(request.query)

		const parsedDate = dayjs(date).startOf('day')
		const weekDay = parsedDate.get('day')

		const possibleHabits = await prisma.habit.findMany({
			where: {
				created_at: {
					lte: date,
				},
				weekDays: {
					some: {
						week_day: weekDay,
					}
				}
			},
		})

		const day = await prisma.day.findFirst({
			where: {
				date: parsedDate.toDate(),
			},
			include: {
				dayHabit: true,
			}
		})

		const completedHabits = day?.dayHabit.map(dayHabit => {
			return dayHabit.habit_id
		}) ?? []

		return {
			possibleHabits,
			completedHabits,
		}
	})

	// toggle completed habit
	app.patch('/habits/:id/toggle', async (request) => {
		//id
		const toggleHabitParams = z.object({
			id: z.string().uuid(),
		})

		const { id } = toggleHabitParams.parse(request.params)

		const today = dayjs().startOf('day').toDate();
		const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate();

		let day = await prisma.day.findUnique({
			where: {
				date: today || yesterday
			}
		})

		if (!day) {
			day = await prisma.day.create({
				data: {
					date: today,
				}
			})
		}

		const dayHabit = await prisma.dayHabit.findUnique({
			where: {
				day_id_habit_id: {
					day_id: day.id,
					habit_id: id
				}
			}
		})

		if (dayHabit) {
			//Descompletar o hábito	
			await prisma.dayHabit.delete({
				where: {
					id: dayHabit.id
				}
			})
		} else {
			//Completar o hábito
			await prisma.dayHabit.create({
				data: {
					day_id: day.id,
					habit_id: id
				}
			})
		}
	})

	// get habit details
	app.get('/summary', async () => {
		// [{ date: 17/01, amount: 5, completed: 1 } , {} , {}]

		const summary = await prisma.$queryRaw`
			SELECT 
				D.id, 
				D.date,
				(
				SELECT 
					cast(count(*) as float)
				FROM day_habits DH
				WHERE DH.day_id = D.id
				) as completed,
				(
				SELECT
					cast(count(*) as float)
				FROM habit_week_days HDW
				JOIN habits H
					ON H.id = HDW.habit_id
				WHERE
					HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
					AND H.created_at <= D.date
				) as amount
			FROM days D
		`

		return summary;
	})


}
