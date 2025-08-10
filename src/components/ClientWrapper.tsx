'use client';

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ClientWrapper({ children, fallback }: ClientWrapperProps) {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return (
			fallback || (
				<div className="flex items-center justify-center min-h-screen bg-gray-900">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
						<div className="text-white text-lg">Loading Apex Protocol...</div>
						<div className="text-gray-400 text-sm mt-2">
							Initializing commodity trading platform
						</div>
					</div>
				</div>
			)
		);
	}

	return <>{children}</>;
}
