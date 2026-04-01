// utils/axiosInterceptor.ts
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { api } from '../services/api-requests';

// Hook pour configurer l'interceptor
export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Interceptor pour les réponses
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,                    // Succès → rien à faire
      (error) => {
        if (error.response?.status === 401) {
          // Optionnel : nettoyer le token/localStorage
          localStorage.removeItem('token');
          // localStorage.removeItem('user');

          // Redirection vers login
          navigate('/login', { replace: true });
        }

        // Toujours rejeter l'erreur pour que le catch du composant fonctionne
        return Promise.reject(error);
      }
    );

    // Nettoyage quand le composant est démonté
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
};