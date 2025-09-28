import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
	return (
		<div className="min-h-screen bg-moso-blue flex flex-col">
			<Header />
			<div className="pt-44 pb-8 px-8 max-w-4xl flex justify-center flex-grow mx-auto">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default Layout;