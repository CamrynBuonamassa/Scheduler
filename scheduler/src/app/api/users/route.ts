import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const users = await prisma.user.findMany();
		return new Response(JSON.stringify(users), {
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
