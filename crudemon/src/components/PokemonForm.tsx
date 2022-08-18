import React, { useRef, useEffect } from 'react';

// Classes and images
import classes from './PokemonForm.module.css';
import saveIcon from '../assets/save-icon.webp';

// Models
import Pokemon from '../Pokemon.model';
import { StateAction } from '../redux/actionType.model';
import { ReducersState } from '../redux/store';

// Action creator
import { setError as errorAC } from '../redux/actionCreators/errorAC';

// Redux-related
import { Dispatch, bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
    addPokemons: (pokemons: Pokemon[]) => (dispatch: Dispatch) => void;
    editPokemon: (pokemon: Pokemon, pokemonIndex: number) => (dispatch: Dispatch) => void;
    pokemonList: Pokemon[];
    isEditing: StateAction;
    setIsNotEditing: () => (dispatch: Dispatch) => void;
    closePokemonForm: any;
    setSearchPokemonList: React.Dispatch<React.SetStateAction<[boolean, Pokemon[] | null]>>;
}

const PokemonForm: React.FC<Props> = props => {
    const { pokemonList, isEditing } = props;

    function inputRangeHandler(
        inputType: 'attack-range' | 'defense-range',
        thumbType: 'attack-thumb' | 'defense-thumb'
    ) {
        const inputRange = document.getElementById(inputType)! as HTMLInputElement;
        const inputRangeValue = inputRange.value;
        const thumbValue = document.getElementById(thumbType);
        thumbValue!.textContent = inputRangeValue;

        const thumbValueWidth = thumbValue!.offsetWidth;
        thumbValue!.style.left = `calc(${inputRangeValue}% - ${thumbValueWidth / 2}px)`;
    }

    const pokemonNameRef = useRef<HTMLInputElement>(null);
    const pokemonImageRef = useRef<HTMLInputElement>(null);
    const pokemonAttackRef = useRef<HTMLInputElement>(null);
    const pokemonDefenseRef = useRef<HTMLInputElement>(null);

    const setError = bindActionCreators(errorAC, useDispatch());
    const error = useSelector((state: ReducersState) => state.errorReducer);

    async function savePokemonHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        let pokemon = {
            attack: +pokemonAttackRef.current!.value,
            defense: +pokemonDefenseRef.current!.value,
            hp: 100,
            id: isEditing ? isEditing.id : '',
            idAuthor: 1,
            image: pokemonImageRef.current!.value,
            name: pokemonNameRef.current!.value,
            type: 'fire',
        };

        if (pokemon.name.length === 0) {
            setError(
                '¡Error! ¡El nombre de tu Pokémon es obligatorio! Tu Pokémon debe tener por lo menos 3 carácteres como parte de su nombre. Por favor, intenta nuevamente.'
            );
        } else if (pokemon.name.length < 3) {
            setError(
                '¡Error! ¡El nombre de tu Pokémon es muy corto! Tu Pokémon debe tener por lo menos 3 carácteres como parte de su nombre. Por favor, intenta nuevamente.'
            );
        } else if (pokemon.name.length > 16) {
            setError(
                '¡Error! ¡El nombre de tu Pokémon es demasiado largo! Tu Pokémon debe tener como máximo 16 carácteres como parte de su nombre. Por favor, intenta nuevamente.'
            );
        } else if (pokemon.image.length === 0) {
            setError(
                '¡Error! ¡La imagen de tu Pokémon es obligatoria! Tu imagen debe tener una URL válida (http(s)://www...). Por favor, intenta nuevamente.'
            );
        } else if (!isAValidURL(pokemon.image)) {
            setError(
                '¡Error! ¡La URL de la imagen de tu Pokémon es inválida! Tu URL debe tener un formato válido (http(s)://www...). Por favor, formatéalo e intenta nuevamente.'
            );
        } else if (pokemon.attack < 0 || pokemon.attack > 100 || pokemon.defense < 0 || pokemon.defense > 100) {
            setError(
                '¡Error! ¡Las stats de tu Pokémon son inválidas! Ambas stats (ataque y defensa) deben estar entre 0 y 100. Por favor, intenta nuevamente.'
            );
        } else {
            const url = window.location.href;
            if (isEditing) {
                try {
                    await fetch(`${url}api/pokemons/${isEditing.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(pokemon),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    setError(
                        'Un error ha ocurrido mientras se trataba de modificar tu Pokémon. Por favor, intenta nuevamente.'
                    );
                }

                const index = pokemonList
                    .map(pokemon => {
                        return pokemon.id;
                    })
                    .indexOf(isEditing.id);

                props.editPokemon(pokemon, index);
            } else {
                try {
                    const response = await fetch(`${url}api/pokemons/`, {
                        method: 'POST',
                        body: JSON.stringify(pokemon),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    let pokemonId = await response.json();
                    pokemonId = pokemonId.name;
                    pokemon.id = pokemonId;

                    await fetch(`${url}api/pokemons/${pokemon.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(pokemon),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    setError(
                        'Un error ha ocurrido mientras se trataba de publicar tu Pokémon. Por favor, intenta nuevamente.'
                    );
                }

                props.addPokemons([pokemon]);
            }

            props.setSearchPokemonList([false, null]);
            props.closePokemonForm();

            setError(null);
            props.setIsNotEditing();
        }
    }

    function isAValidURL(pokemonImage: string) {
        let imageURL;

        try {
            imageURL = new URL(pokemonImage);
        } catch (error) {
            return false;
        }

        return imageURL.protocol === 'http:' || imageURL.protocol === 'https:';
    }

    useEffect(() => {
        if (isEditing) {
            const pokemon = isEditing;
            const inputs = [
                pokemonNameRef.current,
                pokemonImageRef.current,
                pokemonAttackRef.current,
                pokemonDefenseRef.current,
            ];

            inputs.forEach((input, index) => {
                if (index === 0) {
                    input!.value = pokemon!.name;
                } else if (index === 1) {
                    input!.value = pokemon!.image;
                } else if (index === 2) {
                    input!.value = pokemon!.attack.toString();
                    const attackThumb = document.getElementById('attack-thumb');
                    attackThumb!.textContent = pokemon!.attack.toString();

                    const thumbValueWidth = attackThumb!.offsetWidth;
                    attackThumb!.style.left = `calc(${input!.value}% - ${thumbValueWidth / 2}px)`;
                } else {
                    input!.value = pokemon!.defense.toString();
                    const defenseThumb = document.getElementById('defense-thumb');
                    defenseThumb!.textContent = pokemon!.defense.toString();

                    const thumbValueWidth = defenseThumb!.offsetWidth;
                    defenseThumb!.style.left = `calc(${input!.value}% - ${thumbValueWidth / 2}px)`;
                }
            });
        }
    }, [isEditing]);

    return (
        <div className={classes['new-pokemon-form']} data-testid='pokemon-form'>
            <p>Nuevo Pokémon</p>
            {error && (
                <p className={classes.error} data-testid='error-message'>
                    {error}
                </p>
            )}
            <div className={classes['new-pokemon-form-inputs']}>
                <div>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type='text'
                            placeholder='Nombre del Pokémon'
                            ref={pokemonNameRef}
                            maxLength={16}
                            data-testid='pokemon-name'
                        />
                    </div>
                    <div className={classes['pokemon-image-input-container']}>
                        <label>Imagen:</label>
                        <input type='url' placeholder='URL' ref={pokemonImageRef} data-testid='pokemon-image' />
                    </div>
                </div>
                <div>
                    <div className={classes['attack-input-container']}>
                        <div className={classes['new-pokemon-form-labels']}>
                            <label>Ataque: </label>
                        </div>
                        <div className={classes['input-range']}>
                            <p>0</p>
                            <div>
                                <div id='attack-thumb' className={classes['input-range-thumb-value']}>
                                    <p>50</p>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='100'
                                    id='attack-range'
                                    ref={pokemonAttackRef}
                                    onInput={() => inputRangeHandler('attack-range', 'attack-thumb')}
                                />
                            </div>
                            <p>100</p>
                        </div>
                    </div>
                    <div>
                        <div className={classes['new-pokemon-form-labels']}>
                            <label>Defensa: </label>
                        </div>
                        <div className={classes['input-range']}>
                            <p>0</p>
                            <div>
                                <div id='defense-thumb' className={classes['input-range-thumb-value']}>
                                    <p>50</p>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='100'
                                    id='defense-range'
                                    ref={pokemonDefenseRef}
                                    onInput={() => inputRangeHandler('defense-range', 'defense-thumb')}
                                />
                            </div>
                            <p>100</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes['btns-container']}>
                <button
                    type='submit'
                    className={classes['save-btn']}
                    onClick={e => {
                        savePokemonHandler(e);
                    }}
                    data-testid='save-btn'
                >
                    <img src={saveIcon} alt='Ícono de guardado' className={classes['save-img']} />
                    <p>Guardar</p>
                </button>
                <button
                    data-testid='cancel-btn'
                    onClick={() => {
                        props.setIsNotEditing();
                        props.closePokemonForm();
                    }}
                >
                    X Cancelar
                </button>
            </div>
        </div>
    );
};

export default PokemonForm;
