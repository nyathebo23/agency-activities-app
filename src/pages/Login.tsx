import { Backdrop, Box, Button, CircularProgress, Container, LinearProgress, TextField, Typography } from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginSchema, type LoginSchema } from '../types/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../services/auth-service';
import { getErrorMessage } from '../utils/response';
import { useNavigate } from "react-router";
import { storeAgencyList, storeBusDriverList, storeBusList, storeCurrentAgencyId, 
    storePaymentMethodList, storeToken, storeUser } from '../services/storage-service';
import { useAuth } from '../context/auth-context';
import { useEntitiesDatas } from '../services/entities-datas-service';
import { useEffect, useState } from 'react';

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm<LoginSchema>({ 
        mode: 'all',
        resolver: zodResolver(loginSchema)
    });

    const loginMutation = useLogin();
    const [isLoadingDatas, setIsLoadingDatas] = useState(false);
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth();
    const entitiesDatasQuery = useEntitiesDatas(isLoadingDatas);
    const isAllSuccess = entitiesDatasQuery.every(q => q.isSuccess);
    //const isAllFetched = entitiesDatasQuery.every(q => q.data !== undefined);
    const hasAnyError = entitiesDatasQuery.some(q => q.isError);
    //const isLoading = entitiesDatasQuery.some(q => q.isLoading);
    useEffect(() => {
        if (isAllSuccess && !hasAnyError && isLoadingDatas) {
            storeAgencyList(entitiesDatasQuery[0].data!);
            storeBusList(entitiesDatasQuery[1].data!);
            storeBusDriverList(entitiesDatasQuery[2].data!);
            storePaymentMethodList(entitiesDatasQuery[3].data!);
            navigate('/tickets-create', { replace: true });        
        }
    }, [isAllSuccess, hasAnyError, isLoadingDatas, navigate]);
    
    const onSubmit: SubmitHandler<LoginSchema> = async (formData) => {
        loginMutation.mutate(formData, {
            onSuccess: (data) => {
                console.log(data);
                setUser(data.agencyAgent.user);
                setToken(data.token);
                storeUser(data.agencyAgent.user);
                storeToken(data.token);
                storeCurrentAgencyId(data.agencyAgent.agencyId);
                setIsLoadingDatas(true);
            }
        });
    }
    return <Container  

        sx={{
            height: '95vh',
            display: 'flex',
            alignItems: 'center',
        }}>
        <Box     
            component="form" 
            onSubmit={handleSubmit(onSubmit)}  
            sx={{
                minWidth: 300,
                maxWidth: 400,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2, 
                p: 3, 
                border: '1px solid grey',
                margin: '0 auto',
            }}>
                <Typography variant='h3' sx={{marginBottom: 5, marginTop: 2, textAlign: 'center'}}>
                    Sign in
                </Typography>
                {loginMutation.isPending && <LinearProgress  sx={{ marginY: 1 }} />}
                {loginMutation.isError && <Typography className='form-post-error'>
                     {getErrorMessage(loginMutation.error, true)}
                    </Typography>}
                <TextField 
                    {...register('username')} 
                    label="Username" 
                    variant="outlined"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />
                <TextField 
                    {...register('password')}
                    label="Password" 
                    variant="outlined"  
                    type='password'
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button type='submit' variant="contained" sx={{ mt: 2 }} > 
                    Login 
                </Button>

        </Box>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isLoadingDatas}
        >
                <CircularProgress color="inherit" />
        </Backdrop>
    </Container>
}
    
     

export default Login;