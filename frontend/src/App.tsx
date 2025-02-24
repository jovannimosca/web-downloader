import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DownloadForm from "./components/DownloadForm";
import StatusTable from "./components/StatusTable";

const queryClient = new QueryClient();

function App() {
   return (
      <>
         <QueryClientProvider client={queryClient}>
            <DownloadForm />
            <StatusTable />
         </QueryClientProvider>
      </>
   );
}

export default App;
