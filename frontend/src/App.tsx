import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchDefaultHomepage } from './lib/api';

interface HomepageResponse {
  message?: string;
  user_id?: number;
  error?: string;
}

const queryClient = new QueryClient();

function AppContent() {
  const { data, isLoading, error } = useQuery<HomepageResponse | string, Error>({
    queryKey: ['homepage'],
    queryFn: () => fetchDefaultHomepage(),
  });

  const displayMessage = typeof data === 'string' ? data : data?.message || data?.error || 'No data';

  
  return (
    <div className="container mx-auto p-4">

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && <p>{displayMessage}</p>}
     
      <h1>Vite + React</h1>
      <div className="card">
       
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
export default App;