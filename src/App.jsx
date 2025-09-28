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
				{/* Layout wraps all routes */}
				<Route path="/" element={<Layout />}>
					{/* Homepage at root */}
					<Route index element={<Homepage />} />
					{/* Project pages with dynamic ID */}
					<Route path="project/:projectId" element={<ProjectPage />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
