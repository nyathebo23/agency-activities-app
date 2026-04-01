import { useMutation } from '@tanstack/react-query';
import type { LoginSchema } from '../types/schemas/login-schema';
import type { LoginResponse } from '../types/responses/login-response';
import { API_ROUTES } from '../constants/urls';
import axios from 'axios';


export function useLogin() {
    return useMutation({
        mutationFn: async (data: LoginSchema) => {
            const response = await axios.post<LoginResponse>(API_ROUTES.LOGIN, data);
            return response.data
        }
    })
}