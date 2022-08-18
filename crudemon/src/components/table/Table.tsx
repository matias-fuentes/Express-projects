import React from 'react';

// Classes and images
import classes from './Table.module.css';
import editIcon from '../../assets/edit-icon.webp';
import removeIcon from '../../assets/remove-icon.webp';
import imagePreviewIcon from '../../assets/image-preview-icon.webp';

// Models
import Pokemon from '../../Pokemon.model';

// Redux-related
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { removePokemon as removePokemonAC } from '../../redux/actionCreators/pokemonListACs';
import { Dispatch } from 'redux';

interface Props {
    addPokemons: (pokemons: Pokemon[]) => (dispatch: Dispatch) => void;
    pokemonList: Pokemon[];
    setIsEditing: (whatIsEditing: Pokemon) => (dispatch: Dispatch) => void;
    openPokemonForm: any;
    isSearching: boolean;
    searchPokemonList: Pokemon[] | null;
    setSearchPokemonList: React.Dispatch<React.SetStateAction<[boolean, Pokemon[] | null]>>;
}

const Table: React.FC<Props> = props => {
    const { pokemonList, isSearching, searchPokemonList } = props;

    // removePokemon action creator
    const removePokemon = bindActionCreators(removePokemonAC, useDispatch());

    async function deletePokemonHandler(pokemonId: string) {
        try {
            const url = window.location.href;
            await fetch(`${url}api/pokemons/${pokemonId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            throw new Error(
                'Un error ha ocurrido mientras se intentaba eliminar tu Pokémon. Por favor, intenta nuevamente.'
            );
        }

        const index = pokemonList
            .map(pokemon => {
                return pokemon.id;
            })
            .indexOf(pokemonId);

        removePokemon(index);
        props.setSearchPokemonList([false, null]);
    }

    return (
        <table data-testid='pokemon-list'>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Imagen</th>
                    <th>Ataque</th>
                    <th>Defensa</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            {pokemonList && !isSearching && (
                <tbody data-testid='tbody'>
                    {pokemonList.map(pokemon => {
                        return (
                            <tr id={pokemon.id.toString()} key={pokemon.id.toString()}>
                                <td>{pokemon.name}</td>
                                <td className={classes['td-img']}>
                                    <a href={pokemon.image.toString()}>
                                        <img src={imagePreviewIcon} alt='Ícono de previsualización de imagen' />
                                    </a>
                                </td>
                                <td>{pokemon.attack.toString()}</td>
                                <td>{pokemon.defense.toString()}</td>
                                <td className={classes['td-actions']}>
                                    <img
                                        src={editIcon}
                                        alt='Ícono para editar'
                                        className={classes['td-modify-actions']}
                                        onClick={() => {
                                            props.setIsEditing(pokemon);
                                            props.openPokemonForm();
                                        }}
                                    />
                                    <img
                                        src={removeIcon}
                                        alt='Ícono para remover'
                                        onClick={() => {
                                            deletePokemonHandler(pokemon.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            )}
            {searchPokemonList && isSearching && (
                <tbody data-testid='tbody'>
                    {searchPokemonList.map(pokemon => {
                        return (
                            <tr id={pokemon.id.toString()} key={pokemon.id.toString()}>
                                <td>{pokemon.name}</td>
                                <td className={classes['td-img']}>
                                    <a href={pokemon.image.toString()}>
                                        <img src={imagePreviewIcon} alt='Ícono de previsualización de imagen' />
                                    </a>
                                </td>
                                <td>{pokemon.attack.toString()}</td>
                                <td>{pokemon.defense.toString()}</td>
                                <td className={classes['td-actions']}>
                                    <img
                                        src={editIcon}
                                        alt='Ícono para editar'
                                        className={classes['td-modify-actions']}
                                        onClick={() => {
                                            props.setIsEditing(pokemon);
                                            props.openPokemonForm();
                                        }}
                                    />
                                    <img
                                        src={removeIcon}
                                        alt='Ícono para remover'
                                        onClick={() => {
                                            deletePokemonHandler(pokemon.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            )}
        </table>
    );
};

export default Table;
