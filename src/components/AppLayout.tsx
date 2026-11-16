import { Outlet } from "react-router";
import SiteHeader from "./SiteHeader";

type AppLayoutProps = {
    teamCount: number;
    maxTeamSize: number;
};

function AppLayout({ teamCount, maxTeamSize }: AppLayoutProps) {
    return (
        <div className="page">
            <SiteHeader teamCount={teamCount} maxTeamSize={maxTeamSize} />
            <Outlet />
        </div>
    );
}

export default AppLayout;
