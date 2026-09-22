import './App.css';
import { EntitiesInfosProvider } from './context/entities-infos-context';
import { AgentsListPage } from './pages/AgentsListPage';
import Layout from './pages/Layout';
import Login from './pages/Login';
import { Navigate, Route, Routes } from 'react-router';
import { TicketCreatePage } from './pages/TicketCreatePage';
import { TicketListPage } from './pages/TicketListPage';
import { TravelListPage } from './pages/TravelListPage';
import { TicketRefundsPage } from './pages/TicketRefundsPage';
import { AuthProvider } from './context/auth-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerTicketProvider } from './context/customer-ticket-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     
      gcTime: 10 * 60 * 1000, 
      retry: 1,
  }}
})
function App() {
  
  return (
    <main className='main-content'>
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<Navigate to='/tickets-create' replace />} />
              <Route path='/login' element={<Login/>} />
              <Route element={<EntitiesInfosProvider><Layout/></EntitiesInfosProvider>}>
                  <Route path='agency-agents-list' element={<AgentsListPage/>} />
                  <Route index element={<CustomerTicketProvider>
                    <TicketCreatePage/>
                  </CustomerTicketProvider>} />
                  <Route path='tickets-create' element={<CustomerTicketProvider>
                    <TicketCreatePage/>
                  </CustomerTicketProvider>} />
                  <Route path='tickets-list' element={<TicketListPage/>} />
                  <Route path='travels' element={<TravelListPage/>} />
                  <Route path='ticket-refunds' element={<TicketRefundsPage/>} />
              </Route>
            </Routes>
          </AuthProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App
