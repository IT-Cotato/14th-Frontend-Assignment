import { fetchPokemonDetail, fetchPokemonSpecies, PokemonApiError, toPokemon } from './pokemon'
import type { PokemonResource } from './pokemon.types'
import type { PokemonDetails } from '../types/pokemonDetails'

const statLabels: Record<string, string> = { hp: 'HP', attack: 'Attack', defense: 'Defense', speed: 'Speed' }

export async function fetchPokemonDetails(identifier: string, signal: AbortSignal): Promise<PokemonDetails | null> {
  const normalized = identifier.trim().toLowerCase()
  const id = /^\d+$/.test(normalized) ? String(Number(normalized)) : normalized
  try {
    const detail = await fetchPokemonDetail(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}/`, signal)
    const pokemon = toPokemon(detail)
    const primaryAbility = [...detail.abilities].sort((a, b) => a.slot - b.slot).find((item) => !item.is_hidden)?.ability
    const [speciesResult, abilityResult] = await Promise.allSettled([
      fetchPokemonSpecies(detail.species.url, signal),
      primaryAbility ? fetch(primaryAbility.url, { signal }).then(async (response) => {
        if (!response.ok) throw new PokemonApiError(response.status)
        return response.json() as Promise<{ names: { name: string; language: PokemonResource }[] }>
      }) : Promise.resolve(null),
    ])
    signal.throwIfAborted()
    const species = speciesResult.status === 'fulfilled' ? speciesResult.value : null
    const ability = abilityResult.status === 'fulfilled' ? abilityResult.value : null
    const description = species?.flavor_text_entries.find((entry) => entry.language.name === 'ko')
      ?? species?.flavor_text_entries.find((entry) => entry.language.name === 'en')
    return {
      ...pokemon,
      name: species?.names.find((entry) => entry.language.name === 'ko')?.name ?? pokemon.name,
      description: description?.flavor_text.replace(/[\n\f\r]+/g, ' ') ?? '설명을 불러오지 못했어요.',
      heightMeters: detail.height / 10,
      weightKg: detail.weight / 10,
      ability: ability?.names.find((entry) => entry.language.name === 'ko')?.name ?? primaryAbility?.name ?? '정보 없음',
      stats: Object.entries(statLabels).map(([key, name]) => ({
        name, value: detail.stats.find((item) => item.stat.name === key)?.base_stat ?? 0,
      })),
    }
  } catch (error) {
    signal.throwIfAborted()
    if (error instanceof PokemonApiError && error.status === 404) return null
    throw error
  }
}
