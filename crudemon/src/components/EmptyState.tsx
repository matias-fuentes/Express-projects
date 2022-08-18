import React from 'react';

import classes from './EmptyState.module.css';

const EmptyState = () => {
    return (
        <p className={classes['empty-state']}>
            ¡Uh, oh! ¡Tus pokebolas están vacías! ¡Atrapa un nuevo Pokémon a tu lista con el botón: "+ Nuevo"!
        </p>
    );
};

export default EmptyState;
