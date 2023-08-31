import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import "../theme/Styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [youtubeid, setYoutubeid] = useState("");

  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    GetVideoFromDatabase();
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
      axios
        .post(
          "https://api.starselector.com/api/youtubevideos/insert",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            },
          },
          { params: params }
        )
        .then((insertResponse) => {
          if (insertResponse.status === 200) {
            setYoutubeid("");
            GetVideoFromDatabase();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const GetVideoFromDatabase = () => {
    axios
      .get("https://api.starselector.com/api/youtubevideos/list", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setListFiles(res.data.data);
        }
      })
      .catch((error) => {
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
    <Box width={960} height="auto" position="absolute" left={0} right={0} margin="0 auto" className="flex-column flex-center padding-24">
      <Box className="flex-row">
        <TextField id="outlined-basic" label="Youtube id" value={youtubeid} variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setYoutubeid(event.target.value)} />
        <Button size="small" variant="outlined" component="label" sx={{ ml: 1, width: 128 }} onClick={downloadVideo}>
          Fetch
        </Button>
      </Box>
      {listFiles.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Thumbnail</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Duration(In Seconds)</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listFiles.map((row: any) => (
                <TableRow key={row.Key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <img src={row.thumbnail} width="150" height="150" />
                  </TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.lengthSeconds}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      component="label"
                      sx={{ width: 128 }}
                      onClick={() => {
                        DeleteVideoFromDatabase(row.id);
                      }}
                    >
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
