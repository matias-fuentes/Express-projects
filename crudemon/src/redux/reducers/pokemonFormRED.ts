export enum formType {
    OPEN_POKEMON_FORM = 'openPokemonForm',
    CLOSE_POKEMON_FORM = 'closePokemonForm',
}

let initialState = false;

const isLoadingReducer = (state: boolean = initialState, action: { type: string }) => {
    if (action.type === formType.OPEN_POKEMON_FORM) {
        return true;
    } else if (action.type === formType.CLOSE_POKEMON_FORM) {
        return false;
    } else {
        return state;
    }
};

export default isLoadingReducer;
