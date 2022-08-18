// React
import React, { Fragment, useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import Table from './components/table/Table';
import EmptyState from './components/EmptyState';
import PokemonForm from './components/PokemonForm';
import TableHeader from './components/table/TableHeader';

// Pokémon model
import Pokemon from './Pokemon.model';

// Redux-related
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

// Action creators
import isNotLoadingAC from './redux/actionCreators/isLoadingAC';
import * as isEditingACs from './redux/actionCreators/isEditingACs';
import * as pokemonFormACs from './redux/actionCreators/pokemonFormACs';
import * as pokemonListACs from './redux/actionCreators/pokemonListACs';

import { ReducersState } from './redux/store';

const App = () => {
    // isLoading action creators
    const setIsNotLoading = bindActionCreators(isNotLoadingAC, useDispatch());
    const isLoading = useSelector((state: ReducersState) => state.isLoadingReducer);

    /* searchPokemonList useState(). I decided for this state in particular to use the useState() hook,
    since I think that for this implementation in particular, it's more cleaner and readable to use it. */
    const [[isSearching, searchPokemonList], setSearchPokemonList] = useState<[boolean, Pokemon[] | null]>([
        false,
        null,
    ]);

    // pokemonForm action creators
    const { openPokemonForm, closePokemonForm } = bindActionCreators(pokemonFormACs, useDispatch());
    const pokemonForm = useSelector((state: ReducersState) => state.pokemonFormReducer);

    // fullPokemonList action creators
    const { addPokemons, editPokemon } = bindActionCreators(pokemonListACs, useDispatch());
    const pokemonList = useSelector((state: ReducersState) => state.pokemonListReducer);

    // isEditing action creators
    const { setIsEditing, setIsNotEditing } = bindActionCreators(isEditingACs, useDispatch());
    const isEditing = useSelector((state: ReducersState) => state.isEditingReducer);

    useEffect(() => {
        async function getPokemons() {
            let pokemons: Pokemon[] = [];
            let pokemonsObj: any;
            try {
                const url = window.location.href;
                const result = await fetch(`${url}api/pokemons/`);
                pokemonsObj = await result.json();
            } catch (error) {
                throw new Error(
                    'Un error ha ocurrido mientras se intentaban obtener tus Pokémon. Por favor, intenta nuevamente.'
                );
            }

            for (const key in pokemonsObj) {
                pokemonsObj[key].id = key;
                pokemons.push({
                    ...pokemonsObj[key],
                });
            }

            setIsNotLoading();
            addPokemons(pokemons);
        }

        if (pokemonList.length === 0) {
            getPokemons();
        }
    }, []);

    return (
        <Fragment>
            <Header />
            <div className='layout'>
                <TableHeader
                    addPokemons={addPokemons}
                    pokemonList={pokemonList}
                    pokemonForm={pokemonForm}
                    setIsNotEditing={setIsNotEditing}
                    openPokemonForm={openPokemonForm}
                    closePokemonForm={closePokemonForm}
                    setSearchPokemonList={setSearchPokemonList}
                />
                {isLoading && <h2 data-testid='loading-message'>Loading...</h2>}
                {!isLoading && (pokemonList || searchPokemonList) && (
                    <Table
                        addPokemons={addPokemons}
                        pokemonList={pokemonList}
                        setIsEditing={setIsEditing}
                        openPokemonForm={openPokemonForm}
                        isSearching={isSearching}
                        searchPokemonList={searchPokemonList}
                        setSearchPokemonList={setSearchPokemonList}
                    />
                )}
                {pokemonList.length === 0 && !isLoading && <EmptyState />}
                {pokemonForm && (
                    <PokemonForm
                        addPokemons={addPokemons}
                        editPokemon={editPokemon}
                        pokemonList={pokemonList}
                        isEditing={isEditing}
                        setIsNotEditing={setIsNotEditing}
                        closePokemonForm={closePokemonForm}
                        setSearchPokemonList={setSearchPokemonList}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default App;
