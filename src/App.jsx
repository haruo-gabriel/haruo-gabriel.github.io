import Header from "./components/Header";
import Homepage from "./components/Homepage";

function App() {
	return (
		<div className="min-h-screen bg-moso-blue">
			<Header />
			{/* Add padding-top to account for fixed header */}
			<div className="pt-28 flex justify-center">
				<Homepage />
			</div>
		</div>
	);
}

export default App;
