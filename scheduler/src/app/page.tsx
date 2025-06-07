'use client';

import { useState } from 'react';
import Calendar from './components/Calendar';
import Scheduler from './components/Scheduler';
import styled from 'styled-components';

export default function Home() {
	const [refreshTrigger, setRefreshTrigger] = useState(false);

	// force the calendar to refresh when an appointment is added
	// I did this to separate the calendar and scheduler components
	const handleRefresh = () => {
		setRefreshTrigger(!refreshTrigger);
	};

	return (
		<Container>
			<Calendar refreshTrigger={refreshTrigger} />
			<Scheduler onUpdate={handleRefresh} />
		</Container>
	);
}
const Container = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 1rem;
`;
