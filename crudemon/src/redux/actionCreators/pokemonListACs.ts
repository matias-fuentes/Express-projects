import { Dispatch } from 'redux';

// Action types
import { pokemonListEnumAT } from '../actionType.model';

// Model
import Pokemon from '../../Pokemon.model';

export const addPokemons = (pokemons: Pokemon[]) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: pokemonListEnumAT.ADD_POKEMONS,
            payload: {
                pokemons,
            },
        });
    };
};

export const removePokemon = (pokemonIndex: number) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: pokemonListEnumAT.REMOVE_POKEMON,
            payload: {
                pokemonIndex,
            },
        });
    };
};

export const editPokemon = (pokemon: Pokemon, pokemonIndex: number) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: pokemonListEnumAT.EDIT_POKEMON,
            payload: {
                pokemons: [pokemon],
                pokemonIndex,
            },
        });
    };
};
