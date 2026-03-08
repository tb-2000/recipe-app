import OverviewRecipes from "../components/OverviewRecipes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function Overview() {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <h1>Overview</h1>
                <p>Welcome to the recipe app! Here you can find and share your favorite recipes.</p>
                <OverviewRecipes />
            </div>
        </QueryClientProvider>
    )
}