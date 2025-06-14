import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FileRequest } from "@/types/api";
import { postDownload } from "@/api/requests";

export default function DownloadForm() {
  const { handleSubmit, control, reset } = useForm<FileRequest>({
    defaultValues: {
      url: "",
    },
  });
  const onSubmit: SubmitHandler<FileRequest> = (data) => {
    postDownload(data);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        maxWidth: "500px",
        margin: "50px auto",
      }}
    >
      <Controller
        name="url"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField id="url" label="URL" fullWidth {...field} />
        )}
      />
      <Button type="submit" variant="outlined">
        Download
      </Button>
    </Box>
  );
}
