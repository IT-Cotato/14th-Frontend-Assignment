import type { Pokemon } from '../types/pokemon'

export function filterPokemon(pokemon: Pokemon[], query: string, selectedType: string) {
  const search = query.trim().toLowerCase()
  return pokemon.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(search)
      || (item.englishName?.toLowerCase().includes(search) ?? false)
      || (search !== '' && item.number === Number(search.replace(/^#/, '')))
    const matchesType = selectedType === '' || item.types.includes(selectedType)
    return matchesQuery && matchesType
  })
}
