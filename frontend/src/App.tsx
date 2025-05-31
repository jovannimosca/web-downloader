import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DownloadForm from "./components/DownloadForm";
import StatusTable from "./components/StatusTable";
import { Stack, Typography } from "@mui/material";

const queryClient = new QueryClient();

function App() {
   return (
      <>
         <QueryClientProvider client={queryClient}>
            <Stack
               spacing="2rem"
               sx={{ alignItems: "center", padding: "2rem" }}
            >
               <Stack>
                  <Typography variant="h2" align="center">
                     Downloader
                  </Typography>
                  <Typography
                     variant="body1"
                     color="textSecondary"
                     align="center"
                  >
                     Download files from a URL and track their status.
                  </Typography>
               </Stack>
               <DownloadForm />
               <StatusTable />
            </Stack>
         </QueryClientProvider>
      </>
   );
}

export default App;
