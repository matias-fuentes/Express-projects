import Pokemon from '../Pokemon.model';

export enum pokemonListEnumAT {
    ADD_POKEMONS = 'addPokemons',
    REMOVE_POKEMON = 'removePokemon',
    EDIT_POKEMON = 'editPokemon',
}

export enum isEditingEnumAT {
    IS_EDITING = 'isEditing',
    IS_NOT_EDITING = 'isNotEditing',
}

export enum errorEnumAT {
    SET_ERROR = 'setError',
}

export type StateAction = Pokemon | null;
