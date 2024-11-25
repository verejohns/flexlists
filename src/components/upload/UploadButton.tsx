import { Box, Button, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { isFileExtensionAllowed } from "src/utils/fileUtils";
import { isSucc } from "src/models/ApiResponse";
import { useTheme } from "@mui/material/styles";
import { fileService } from "flexlists-api";
import { useEffect, useState } from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import {
  downloadFileDefault,
  downloadFileUrl,
  imageStringToJSON,
} from "src/utils/flexlistHelper";
import ReactPlayer from "react-player";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { use } from "passport";
import { get } from "lodash";

type UploadButtonProps = {
  translations: TranslationText[];
  fileAcceptTypes: string[];
  file?: { fileId: string; fileName: string; fieldDefault?: boolean } | File;
  type?: string;
  onUpload: (file?: File) => void;
  setFlashMessage?: (message: FlashMessageModel) => void;
  viewId: number;
  fieldId?: number;
};

const UploadButton = ({
  translations,
  file,
  fileAcceptTypes,
  type,
  onUpload,
  setFlashMessage,
  viewId,
  fieldId,
}: UploadButtonProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string>(
    file instanceof File
      ? (file as File).name
      : file?.fileId && file?.fileName
      ? file.fileName
      : ""
  );
  const LinearProgressWithLabel = (
    props: LinearProgressProps & { value: number }
  ) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      handleUploadedFile(file);
    }
  };
  const getBlobFromUrl = async (myImageUrl: string) => {
    return new File(
      [
        await (
          await fetch(downloadFileDefault(viewId.toString(), fieldId))
        ).blob(),
      ],
      (file as any).fileName,
      {
        // type: "blob",
      }
    );
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("GET", myImageUrl, true);
      request.responseType = "blob";
      request.onload = () => {
        resolve(request.response);
      };
      request.onerror = reject;
      request.send();
    });
  };

  // useEffect(() => {
  //   async function getDefault() {
  //     if (file && !(file instanceof File) && file?.fieldDefault) {
  //       console.log("puta");
  //       const file = (await getBlobFromUrl(
  //         downloadFileDefault(viewId.toString(), fieldId)
  //       )) as File;
  //       console.log("file", file);
  //       setCurrentFileName(file.name);
  //       onUpload(file);
  //     }
  //   }
  //   getDefault();
  // }, [file]);

  const handleUploadedFile = async (file: File) => {
    if (!isFileExtensionAllowed(file.name, fileAcceptTypes)) {
      setFlashMessage &&
        setFlashMessage({
          message: t("File Extension Not Allowed"),
          type: "error",
        });

      return;
    }
    setCurrentFileName(file.name);
    onUpload(file);

    //setProgress(0);

    // const formData = new FormData();
    // formData.append("file", file);
    // const response = await uploadFile(viewId, formData, setProgress);

    // if (isSucc(response) && response.data && response.data.fileId) {
    //   onUpload({
    //     fileId: response.data.fileId,
    //     fileName: file.name,
    //   });

    //   setProgress(100);
    // } else {
    //   setFlashMessage &&
    //     setFlashMessage({ message: response.message, type: "error" });
    // }
  };

  const deleteFile = () => {
    setProgress(0);
    onUpload(undefined);
    setCurrentFileName("");
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) handleUploadedFile(droppedFile);
  };

  const handleFileDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const getFileValue = () => {
    if (!file) return "";
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === "object" && file?.fileId) {
      if (file?.fieldDefault) {
        return downloadFileDefault(viewId.toString(), fieldId, file.fileId);
      }
      return downloadFileUrl(file.fileId, viewId, fieldId);
    }
    if (typeof file === "string") {
      let fileObj = imageStringToJSON(file);
      if (fileObj?.fieldDefault) {
        return downloadFileDefault(viewId.toString(), fieldId, fileObj?.fileId);
      }
      return downloadFileUrl(fileObj?.fileId, viewId, fieldId);
    }
    return "";
  };
  return (
    <Box
      onDrop={handleFileDrop}
      onDragOver={handleFileDragOver}
      onDragEnter={handleFileDragEnter}
      onDragLeave={handleFileDragLeave}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {type && (
          <Box sx={{ width: "57%", marginBottom: 1 }}>
            {type === "image" ? (
              // <a
              //   href={downloadFileUrl(file ? file.fileId : "", viewId)}
              //   target="_blank"
              // >

              <Box
                component="img"
                sx={{
                  mb: 2,
                }}
                alt=""
                src={
                  getFileValue()
                  // file && file instanceof File
                  //   ? URL.createObjectURL(file)
                  //   : imageStringToJSON(file)?.fileId
                  //   ? !file?.fieldDefault && imageStringToJSON(file)!.fileId
                  //     ? downloadFileUrl(
                  //         imageStringToJSON(file)!.fileId,
                  //         viewId,
                  //         fieldId
                  //       )
                  //     : imageStringToJSON(file)!.fileId
                  //     ? downloadFileDefault(viewId.toString(), fieldId)
                  //     : ""
                  //   : ""
                }
              />
            ) : // </a>
            type === "video" ? (
              <ReactPlayer
                url={
                  getFileValue()
                  // file && file instanceof File
                  //   ? URL.createObjectURL(file)
                  //   : imageStringToJSON(file)?.fileId
                  //   ? !file?.fieldDefault && imageStringToJSON(file)!.fileId
                  //     ? downloadFileUrl(imageStringToJSON(file)!.fileId, viewId)
                  //     : imageStringToJSON(file)!.fileId
                  //     ? downloadFileDefault(viewId.toString(), fieldId)
                  //     : ""
                  //   : ""
                }
                width="100%"
                height="auto"
                controls
              />
            ) : type === "doc" ? (
              <></>
            ) : (
              <></>
            )}
          </Box>
        )}
        {progress ? (
          <Box sx={{ width: "40%" }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button component="label" variant="contained" sx={{ mr: 3 }}>
          {t("Drag File or Click to Browse")}
          <input
            type="file"
            accept={fileAcceptTypes
              .map((x) => {
                if (x === "*/*") {
                  return x;
                }
                return `.${x}`;
              })
              .join(",")}
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {currentFileName && (
          <span>
            {currentFileName}
            <Tooltip title={t("Delete File")}>
              <DeleteIcon
                sx={{
                  ml: 1,
                  color: theme.palette.palette_style.error.dark,
                  cursor: "pointer",
                }}
                onClick={deleteFile}
              />
            </Tooltip>
          </span>
        )}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);
