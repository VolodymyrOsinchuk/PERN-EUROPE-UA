import { Fragment } from "react";
import {
  Button,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
// import Grid from "@mui/material/Grid2";
import { ads } from "../components";

const ListView = () => (
  <List>
    {ads.map((ad, index) => (
      <Fragment key={index}>
        <ListItem className="list-view-item" alignItems="flex-start">
          <Box display="flex">
            <img src={ad.image} alt={ad.title} className="list-view-image" />
            <ListItemText
              primary={<Typography variant="h6">{ad.title}</Typography>}
              secondary={
                <Fragment>
                  <Typography variant="body2" color="text.secondary">
                    {ad.description}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<span className="material-icons">category</span>}
                    label={ad.category}
                    style={{ margin: "5px" }}
                  />
                  <Chip
                    size="small"
                    icon={<span className="material-icons">location_on</span>}
                    label={ad.location}
                    style={{ margin: "5px" }}
                  />
                  <Chip
                    size="small"
                    icon={<span className="material-icons">event</span>}
                    label={new Date(ad.date).toLocaleDateString("uk-UA")}
                    style={{ margin: "5px" }}
                  />
                  <div style={{ marginTop: "10px" }}>
                    <Button size="small" color="primary">
                      Контакти
                    </Button>
                    <Button size="small" color="primary">
                      Поскаржитись
                    </Button>
                  </div>
                </Fragment>
              }
            />
          </Box>
        </ListItem>
        {index < ads.length - 1 && <Divider />}
      </Fragment>
    ))}
  </List>
);

export default ListView;
