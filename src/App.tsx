import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  return (

    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
        {/* <ToastProvider> */}
          <RouterProvider router={router} />
        {/* </ToastProvider> */}
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}
  
export default App