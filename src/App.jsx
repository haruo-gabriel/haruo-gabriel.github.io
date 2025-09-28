import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./components/Homepage";
import ProjectPage from "./pages/ProjectPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
	return (
		<Router>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Homepage />} />
					<Route path="projects/:projectId" element={<ProjectPage />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
