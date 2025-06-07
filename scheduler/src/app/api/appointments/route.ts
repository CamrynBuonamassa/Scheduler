import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const appointments = await prisma.appointment.findMany();
		return new Response(JSON.stringify(appointments), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('GET /api/appointments error:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { title, start, end, attendeeIds } = body;

		if (!title || !start || !end) {
			return new Response(
				JSON.stringify({ error: 'Missing required fields' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const newAppointment = await prisma.appointment.create({
			data: {
				title,
				start,
				end,
				attendees: {
					connect: attendeeIds.map((id: number) => ({ id })),
				},
			},
		});

		return new Response(JSON.stringify(newAppointment), {
			status: 201,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('POST /api/appointments error:', error);
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
