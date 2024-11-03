import { SignInForm, CreateAccountForm } from '../components/forms';
import { LoginWrapper } from '../components/styled';
import { useState } from 'react';
import logo from '../assets/logo.png';
import { useTheme } from '@mui/material/styles';
import LogoLightMode from '../assets/logo_light_mode.png';
import { determineThemeBackground } from '../utilities/helpers';
import { ResponseType, useGlobalContext } from '../context';

export const Login = () => {
    const { handleBannerMessage } = useGlobalContext();
    const [showCreateAccount, setShowCreateAccount] = useState<Boolean>(false);
    const theme = useTheme();

    return (
        <LoginWrapper backgroundColor={determineThemeBackground(theme.palette.mode)}>
            <img
                src={theme.palette.mode === 'dark' ? logo : LogoLightMode}
                alt='logo'
                className='logo'
                style={{ height: showCreateAccount ? '175px' : '200px' }}
            />

            {showCreateAccount ? (
                <CreateAccountForm
                    setShowCreateAccount={setShowCreateAccount}
                    onSuccess={() => {
                        setShowCreateAccount(false);
                        handleBannerMessage(
                            ResponseType.Success,
                            'Your account has been successfully created. Please log in.'
                        );
                    }}
                />
            ) : (
                <SignInForm setShowCreateAccount={setShowCreateAccount} />
            )}
        </LoginWrapper>
    );
};
