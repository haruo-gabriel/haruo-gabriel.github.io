import Header from "./components/Header";

function App() {
	return (
		<div>
			<Header />
			{/* Add placeholder content to make the page scrollable */}
			<div className="h-[2000px] bg-gray-100">
				{/* This div creates a large scrollable area */}
				<p className="text-center pt-8 text-lg text-gray-700">
					Scroll down to see the header shrink!
				</p>
			</div>
		</div>
	);
}

export default App;
