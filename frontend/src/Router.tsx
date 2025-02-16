import { createBrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import GeneralPage from "./pages/GeneralPage";
import NotFound from "./components/errors/NotFound";

 const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <Header />
                <GeneralPage />
            </>
        ),
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                path: '/tasks'
                
            }
        ]
    }
]);

export default router;