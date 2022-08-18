// Action types
import { pokemonListEnumAT } from '../actionType.model';

// Model
import Pokemon from '../../Pokemon.model';

interface PokemonAction {
    type: string;
    payload: {
        pokemons: Pokemon[];
        pokemonIndex?: number;
    };
}

let initialState: Pokemon[] = [];

const pokemonListReducer = (state: Pokemon[] = initialState, action: PokemonAction) => {
    const stateCopy = [...state];

    if (action.type === pokemonListEnumAT.ADD_POKEMONS) {
        const { pokemons } = action.payload;
        pokemons.forEach(pokemon => {
            stateCopy.push(pokemon);
        });
        return stateCopy;
    } else if (action.type === pokemonListEnumAT.REMOVE_POKEMON) {
        const { pokemonIndex } = action.payload;
        stateCopy.splice(pokemonIndex!, 1);
        return stateCopy;
    } else if (action.type === pokemonListEnumAT.EDIT_POKEMON) {
        const { pokemonIndex } = action.payload;
        const editedPokemon = action.payload.pokemons[0];
        stateCopy[pokemonIndex!] = editedPokemon;
        return stateCopy;
    } else {
        return state;
    }
};

export default pokemonListReducer;
