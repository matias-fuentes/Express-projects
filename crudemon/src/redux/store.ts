import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import isLoadingReducer from './reducers/isLoadingRED';
import pokemonListReducer from './reducers/pokemonListRED';
import isEditingReducer from './reducers/isEditingRED';
import pokemonFormReducer from './reducers/pokemonFormRED';
import errorReducer from './reducers/errorRED';

const reducer = combineReducers({
    isLoadingReducer,
    pokemonListReducer,
    isEditingReducer,
    pokemonFormReducer,
    errorReducer,
});
const store = configureStore({ reducer });

export default store;
export type ReducersState = ReturnType<typeof reducer>;
