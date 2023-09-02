import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import "../theme/Styles.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["ycp"]);
  const [youtubeid, setYoutubeid] = useState("");
  const [tableLoading, setTableLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    if (cookies && cookies.ycp && cookies.ycp.username) {
      navigate(`/dashboard`);
    } else {
      removeCookie("ycp", { path: "/" });
      navigate(`/login`);
    }
  }, [removeCookie, cookies, navigate]);

  useEffect(() => {
    GetVideoFromDatabase();
  }, []);

  const Logout = () => {
    removeCookie("ycp", { path: "/" });
    navigate(`/login`);
  };

  const downloadVideo = async () => {
    setButtonLoading(true);
    const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/dl",
      params: { id: youtubeid },
      headers: {
        "X-RapidAPI-Key": "Qtw5daIGTJmsha5QLAJJypOYspmxp1Fvr02jsnBNF5nCbUk9IG",
        "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      let dataRes = response.data.formats.find((a: any) => a.mimeType.includes("video/mp4"));
      const params = {
        id: response.data.id,
        video_url: dataRes.url,
        channel_title: response.data.channelTitle,
        title: response.data.title,
        description: response.data.description,
        thumbnail: response.data.thumbnail.pop().url,
        lengthSeconds: response.data.lengthSeconds,
        viewCount: response.data.viewCount,
      };
      const datares = await axios({
        method: "post",
        url: "https://api.starselector.com/api/youtubevideos/insert",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        data: params,
      });
      setButtonLoading(false);
      if (datares.status === 200) {
        setYoutubeid("");
        GetVideoFromDatabase();
      } else {
        console.error("error");
      }
    } catch (error) {
      setButtonLoading(false);
      console.error(error);
    }
  };

  const GetVideoFromDatabase = () => {
    setTableLoading(true);
    axios
      .get("https://api.starselector.com/api/youtubevideos/list", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((res) => {
        setTableLoading(false);
        if (res.status === 200) {
          setListFiles(res.data.data);
        }
      })
      .catch((error) => {
        setTableLoading(false);
        console.error(error);
      });
  };

  const DeleteVideoFromDatabase = (id: string) => {
    axios
      .delete("https://api.starselector.com/api/youtubevideos/delete", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        params: {
          id: id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          GetVideoFromDatabase();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box>
      <Box className="flex-row flex-align-center padding-left-16 padding-right-16" sx={{ width: "100%", height: 64, justifyContent: "space-between", borderBottom: "1px solid #dedede", zIndex: 5, backgroundColor: "white", position: "fixed" }}>
        <Box className="flex-row">
          <img src={require("../assets/logo192.png")} alt="Youtube C-Panel" width={32} height={32} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            YouTube cPanel
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" component="label" sx={{ width: 96 }} onClick={() => Logout()}>
            Logout
          </Button>
        </Box>
      </Box>
      <Box width={960} height="auto" position="absolute" left={0} right={0} margin="32px auto" className="flex-column flex-center padding-24">
        <Box className="flex-row" sx={{ mb: 2, mt: 4 }}>
          <Typography variant="h4">Add your videos</Typography>
        </Box>
        <Box className="flex-row">
          <TextField id="outlined-basic" label="Youtube id" value={youtubeid} variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setYoutubeid(event.target.value)} />
          <LoadingButton loading={buttonLoading} size="small" variant="outlined" component="label" sx={{ ml: 1, width: 128 }} onClick={downloadVideo}>
            Fetch
          </LoadingButton>
        </Box>
        {tableLoading ? (
          <Box sx={{ display: "flex", mt: 14 }}>
            <CircularProgress />
          </Box>
        ) : (
          listFiles.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table sx={{ minWidth: 360 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Thumbnail</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="center">Duration(In Seconds)</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listFiles.map((row: any, index: number) => (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        <img src={row.thumbnail} alt={row.title} width="120" height="90" />
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="center">{row.lengthSeconds}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" component="label" sx={{ width: 96 }} onClick={() => DeleteVideoFromDatabase(row.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
