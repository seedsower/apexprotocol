export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-white mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-gray-300 mb-6">
					Page Not Found
				</h2>
				<p className="text-gray-400 mb-8">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<a
					href="/"
					className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
				>
					Go Home
				</a>
			</div>
		</div>
	);
}
