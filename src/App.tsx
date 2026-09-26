import { useState } from "react";
import PokemonHeader from "./PokemonHeader";
import MainPanel from "./MainPanel";

function App() {
    type TabKey = "home" | "pokedex" | "myTeam";

    const [currentTab, setCurrentTab] = useState<TabKey>("home");

    const handleCurrentTab = (tab: TabKey) => {
        setCurrentTab(tab);
    };

    return (
        <div className="flex flex-col gap-6 px-[80px] py-[36px] gap-[24px] bg-canvas">
            <PokemonHeader
                currentTab={currentTab}
                handleCurrentTab={handleCurrentTab}
            />
            <MainPanel currentTab={currentTab} />
        </div>
    );
}

export default App;
