import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import "../theme/Styles.css";
import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { DeleteImageToS3WithNativeSdk, GetObjectsFromS3, UploadImageToS3WithNativeSdk } from "../utils/AWSFileUpload";
import axios from "axios";

const DashboardPage = () => {
  const [image, setImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [youtubeid, setYoutubeid] = useState("");
  const [uploadFileUpload, setUploadFileUpload] = useState<any>();
  const [errorDI, setDIError] = useState(false);
  const [errorDIText, setDIErrorText] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [designButtonText, setDesignButtonText] = useState("Select Video");

  const [listFiles, setListFiles] = useState([]);

  const onBucketList = (data: any) => {
    setListFiles(data);
  };

  useEffect(() => {
    GetObjectsFromS3(onBucketList);
  }, []);

  const downloadVideo = async () => {
    const options = {
      method: "GET",
      url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
      params: { id: youtubeid },
      headers: {
        "X-RapidAPI-Key": "Qtw5daIGTJmsha5QLAJJypOYspmxp1Fvr02jsnBNF5nCbUk9IG",
        "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const params = {
        id: response.data.id,
        video_url: response.data.adaptiveFormats[0].url,
        channel_title: response.data.channelTitle,
        title: response.data.title,
        description: response.data.description,
        thumbnail: response.data.thumbnail[0].url,
        lengthSeconds: response.data.lengthSeconds,
        viewCount: response.data.viewCount,
      };
      debugger;
      axios.post(
        "https://localhost:7094/api/youtubevideos/insert",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        },
        { params: params }
      ).then((insertResponse) => {
        debugger;
        console.log(insertResponse);
      }).catch((error) => {
        debugger;
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onFileChoose = (e: any) => {
    if (e.currentTarget !== null && e.currentTarget.files !== null) {
      setUploadFileUpload(e.currentTarget.files[0]);
      let fileName = e.currentTarget.files[0].name;
      if (fileName !== undefined) {
        setDIErrorText(fileName.trim());
        setImage(fileName);
        setUploadedImage(fileName);
      }
      setDesignButtonText("Change");
      setDIError(false);
    }
  };

  const onUploadVideo = () => {
    setImage("");
    setUploadedImage("");
    setUploadFileUpload(null);
    setDesignButtonText("Select Video");
    setDIError(false);
    setDIErrorText("");
    setEndTime(new Date().getTime());
    GetObjectsFromS3(onBucketList);
  };

  const uploadVideo = () => {
    setStartTime(new Date().getTime());
    let imageName: string = uuid();
    let fileExtension = uploadedImage.split(".").pop();
    setUploadedImage(imageName + "." + fileExtension);
    UploadImageToS3WithNativeSdk(uploadFileUpload, imageName + "." + fileExtension, onUploadVideo);
  };

  const onDeleteVideo = () => {
    // show snackbar
    GetObjectsFromS3(onBucketList);
  };

  const deleteVideo = (fileName: string) => {
    DeleteImageToS3WithNativeSdk(fileName, onDeleteVideo);
  };

  return (
    <Box width={960} height="auto" position="absolute" left={0} right={0} margin="0 auto" className="flex-column flex-center padding-24">
      <Box className="flex-row">
        {/* {image !== "" && (
          <Box width="auto" height={40} border="1px solid #efefef" className="flex-center padding-left-16 padding-right-16">
            <Typography variant="subtitle2">{image}</Typography>
          </Box>
        )}
        <Button size="small" variant="outlined" component="label" sx={{ ml: 1, width: 128 }}>
          {designButtonText}
          <input type="file" hidden accept="video/mp4" onChange={onFileChoose} />
        </Button> */}
        <TextField id="outlined-basic" label="Youtube id" variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setYoutubeid(event.target.value)} />
        <Button size="small" variant="outlined" component="label" sx={{ ml: 1, width: 128 }} onClick={downloadVideo}>
          Download
        </Button>
        <Button size="small" variant="contained" disabled={image === ""} component="label" sx={{ ml: 1, width: 128 }} onClick={uploadVideo}>
          Upload
        </Button>
        <Typography>{startTime}</Typography>
        <Typography>{endTime}</Typography>
      </Box>
      {listFiles.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Thumbnail</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Upload Date</TableCell>
                <TableCell align="center">Size</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listFiles.map((row: any) => (
                <TableRow key={row.Key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <video width="150" height="150" controls>
                      <source src={""} type="video/mp4" />
                    </video>
                  </TableCell>
                  <TableCell align="center">{row.Key}</TableCell>
                  <TableCell align="center">{new Date(row.LastModified).toDateString()}</TableCell>
                  <TableCell align="center">{(row.Size / 1000000).toFixed(2)}Mb</TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="contained" component="label" sx={{ width: 128 }} onClick={() => deleteVideo(row.Key)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DashboardPage;
