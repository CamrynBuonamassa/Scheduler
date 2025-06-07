'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type User = {
	id: number;
	name: string;
	appointments: string[];
};

export default function Scheduler({ onUpdate }: { onUpdate: () => void }) {
	const [showScheduler, setShowScheduler] = useState(false);
	const [title, setTitle] = useState('');
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const [startTime, setStartTime] = useState('09:00');
	const [endTime, setEndTime] = useState('10:00');
	const [users, setUsers] = useState([]);
	const [attendeeIds, setAttendeeIds] = useState<number[]>([]);

	useEffect(() => {
		fetch('/api/users')
			.then((res) => res.json())
			.then((data) => {
				setUsers(data);
			})
			.catch((err) => console.error('Error fetching users:', err));
	}, []);

	// merge date + time into datetime
	const getDateTime = (timeStr: string) => {
		if (!selectedDate) return null;
		const [hours, minutes] = timeStr.split(':').map(Number);
		return new Date(
			selectedDate.getFullYear(),
			selectedDate.getMonth(),
			selectedDate.getDate(),
			hours,
			minutes
		);
	};

	const handleCheckedUser = (id: number) => {
		setAttendeeIds((attendeeIds) => {
			if (attendeeIds.includes(id)) {
				return attendeeIds.filter((itemId) => itemId !== id);
			} else {
				return [...attendeeIds, id];
			}
		});
	};

	function makeAppointment(
		startDateTime: Date,
		endDateTime: Date,
		attendeeIds: number[]
	) {
		// const attendees = users.map((user: User) => {  user.checked === true ? user : null; });
		// TODO: check if appointment time is available before adding, add error handling
		fetch('/api/appointments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: title,
				start: startDateTime,
				end: endDateTime,
				attendeeIds: attendeeIds,
			}),
		})
			.then(() => {
				onUpdate();
			})
			.catch((err) => {
				console.error('Error creating event:', err);
			});
	}
	return showScheduler ? (
		<div>
			<h2>Schedule an Appointment</h2>
			<Row>
				<Label>Title</Label>
				<Input
					placeholder='Title'
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Row>
			<Row>
				<Label>Date</Label>
				{/* not allowing for start and end time on different dates because this is a tool for scheduling therapy appointments */}
				<DatePicker
					selected={selectedDate}
					onChange={(date) => setSelectedDate(date)}
					dateFormat='PPP' // longer date format
					minDate={new Date()} // disables past dates
				/>
			</Row>
			<Row>
				<Label>Start Time</Label>
				<Input
					type='time'
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
				/>
			</Row>
			<Row>
				<Label>End Time</Label>
				<Input
					type='time'
					value={endTime}
					onChange={(e) => setEndTime(e.target.value)}
				/>
			</Row>
			<Row>
				<Label>Users</Label>

				{users &&
					users.map((user: User) => (
						<label key={user.id}>
							<input
								type='checkbox'
								value={user.id}
								checked={attendeeIds.includes(user.id)}
								onChange={() => handleCheckedUser(user.id)}
							/>
							{user.name}
						</label>
					))}
			</Row>
			<Row>
				<SubmitButton
					onClick={() => {
						const startDateTime = getDateTime(startTime);
						const endDateTime = getDateTime(endTime);
						if (title && startDateTime && endDateTime) {
							// add appointment to db
							if (startDateTime >= endDateTime) {
								alert('Start time must be before end time.');
							} else {
								makeAppointment(
									startDateTime,
									endDateTime,
									attendeeIds
								);
							}
						} else {
							alert('Missing required field.');
						}
					}}
				>
					Create Appointment
				</SubmitButton>
				<Button onClick={() => setShowScheduler(false)}>Close</Button>
			</Row>
		</div>
	) : (
		<Button onClick={() => setShowScheduler(true)}>
			Schedule an Appointment
		</Button>
	);
}

const Label = styled.label`
	padding-right: 32px;
`;

const Row = styled.div`
	padding: 10px 0;
`;

const Input = styled.input`
	width: 100px;
`;

const SubmitButton = styled.button`
	background-color: #c5debd;
	padding: 8px 16px;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-size: 1rem;
	margin-right: 12px;

	&:hover {
		background-color: #aec4a7;
	}
`;

const Button = styled.button`
	background-color: #c5c7c5;
	padding: 8px 16px;
	border-radius: 8px;
	border: none;
	cursor: pointer;
	font-size: 1rem;
	max-width: 200px;

	&:hover {
		background-color: #b1b3b1;
	}
`;
