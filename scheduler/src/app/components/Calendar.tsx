'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, globalizeLocalizer } from 'react-big-calendar';
import globalize from 'globalize';
import 'react-big-calendar/lib/css/react-big-calendar.css';

type Appointment = {
	id: number;
	title: string;
	start: Date;
	end: Date;
};

const localizer = globalizeLocalizer(globalize);

export default function MyCalendar({
	refreshTrigger,
}: {
	refreshTrigger: boolean;
}) {
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	function fetchAppointments() {
		fetch('/api/appointments')
			.then((res) => res.json())
			.then((data) => {
				const formatted = data.map((appointment: Appointment) => ({
					...appointment,
					start: new Date(appointment.start),
					end: new Date(appointment.end),
				}));
				setAppointments(formatted);
			})
			.catch((err) => console.error('Error fetching appointments:', err));
	}

	useEffect(() => {
		fetchAppointments();
	}, [refreshTrigger]);

	return (
		<div>
			<h2>Calendar</h2>
			<Calendar
				localizer={localizer}
				events={appointments}
				startAccessor='start'
				endAccessor='end'
				style={{ height: '80vh', width: '100vh' }}
				defaultDate={new Date()}
				defaultView='month'
			/>
		</div>
	);
}
