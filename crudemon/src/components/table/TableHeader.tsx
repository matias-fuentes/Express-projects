import React, { Fragment, useRef } from 'react';

// Classes and images
import classes from './TableHeader.module.css';
import searchIcon from '../../assets/search-icon.webp';

// Models
import Pokemon from '../../Pokemon.model';

// Redux-related
import { Dispatch } from 'redux';

interface Props {
    addPokemons: (pokemons: Pokemon[]) => (dispatch: Dispatch) => void;
    pokemonList: Pokemon[];
    pokemonForm: boolean;
    setIsNotEditing: () => (dispatch: Dispatch) => void;
    openPokemonForm: any;
    closePokemonForm: any;
    setSearchPokemonList: React.Dispatch<React.SetStateAction<[boolean, Pokemon[] | null]>>;
}

const TableHeader: React.FC<Props> = props => {
    const { pokemonList, pokemonForm } = props;

    const searchRef = useRef<HTMLInputElement>(null);
    function searchHandler(e: React.FormEvent) {
        e.preventDefault();
        const searchInput = searchRef.current!.value;

        if (searchInput === '') {
            props.setSearchPokemonList([false, null]);
        } else {
            const pokemonListCopy = [...pokemonList];
            const searchList = pokemonListCopy.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            props.setSearchPokemonList([true, searchList]);
        }
    }

    return (
        <Fragment>
            <h1 className={classes['title']}>Listado de Pokémons</h1>
            <div className={classes['pokemon-list-header']}>
                <div className={classes['search-bar-container']}>
                    <form onSubmit={e => searchHandler(e)}>
                        <input
                            type='text'
                            placeholder='Buscar'
                            className={classes['search-bar']}
                            tabIndex={1}
                            ref={searchRef}
                            data-testid='search-bar'
                        />
                        <img src={searchIcon} alt='Ícono de búsqueda' className={classes['search-icon']} />
                    </form>
                </div>
                <button
                    data-testid='new-btn'
                    tabIndex={2}
                    onClick={() => {
                        props.setIsNotEditing();
                        if (pokemonForm) {
                            props.closePokemonForm();
                        } else {
                            props.openPokemonForm();
                        }
                    }}
                >
                    <p>+ Nuevo</p>
                </button>
            </div>
        </Fragment>
    );
};

export default TableHeader;
