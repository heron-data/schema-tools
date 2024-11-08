import { Toaster } from '@/components/ui/toaster';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
			<Toaster />
			<Analytics />
		</>
	);
}
