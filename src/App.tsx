import PokemonHeader, { HeaderBox, PokemonSearch, PokemonTitle, PokemonReco } from './PokemonHeader' 
import { useState } from 'react';
import PokemonList from './PokemonList'
//현재 App.tsx와 같은 src 폴더에 있는 PokemonHeader.tsx에서 가져온다.

function App() {
  const [menu, setMenu] = useState<'home' | 'dict' | 'myTeam'>('home');

  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
      <div className="page-container">
        {menu === 'home' ? (
          <>
            <HeaderBox
            menu="home"
            teamCount={0}
            teamMax={0}
            onMenuChange={setMenu}
          />

          <PokemonHeader />
          <PokemonSearch 
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearch={() => setSearchKeyword(searchInput)}
          />
          <PokemonReco />
          <PokemonList search={searchKeyword} />
        
        </>
        ) : menu === 'dict' ? (
          <>
            <HeaderBox
              menu="dict"
              teamCount={3}
              teamMax={6}
              onMenuChange={setMenu}
            />
            
            <PokemonTitle />
            <PokemonSearch 
              search={searchInput}
              onSearchChange={setSearchInput}
              onSearch={() => setSearchKeyword(searchInput)}
            />
            <PokemonList search={searchKeyword} />
          </>
        ) : (
          <>
            <HeaderBox
              menu="myTeam"
              teamCount={3}
              teamMax={6}
              onMenuChange={setMenu}
            />

            {/* 내 팀 페이지 */}
          </>
        )}
    </div>
  );
}

export default App