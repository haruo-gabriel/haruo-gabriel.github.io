import Header from "./components/Header";
import Homepage from "./components/Homepage";
import Footer from "./components/Footer";

function App() {
	return (
		<div className="min-h-screen bg-moso-blue">
			<Header />
			<div className="pt-48 pb-8 flex justify-center">
				<Homepage />
			</div>
			<Footer />
		</div>
	);
}

export default App;
