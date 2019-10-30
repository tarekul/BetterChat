import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SendIcon from "@material-ui/icons/Send";
import withStyles from "@material-ui/core/styles/withStyles";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AuthContext from "../context/authContext";

const styles = {
  grid: {},
  card: {
    marginBottom: "20px",
    backgroundColor: "rgb(245,245,245)",
    minHeight: "180px"
  },
  content: {
    paddingTop: "90px",
    textAlign: "center"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  bigAvatar: {
    width: 60,
    height: 60
  },
  loading: {
    marginLeft: "50%"
  }
};

class Home extends Component {
  state = {
    posts: null,
    newPost: ""
  };
  componentDidMount() {
    Axios.get(
      "https://us-central1-better-f844e.cloudfunctions.net/api/posts"
    ).then(res => {
      this.setState({ posts: res.data });
    });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e, token) => {
    e.preventDefault();
    if (this.state.newPost.trim() !== "") {
      Axios.post(
        "https://us-central1-better-f844e.cloudfunctions.net/api/post",
        {
          body: this.state.newPost
        },
        { headers: { Authorization: "Bearer " + token } }
      ).then(res => {
        Axios.get(
          "https://us-central1-better-f844e.cloudfunctions.net/api/posts"
        ).then(res => {
          this.setState({ posts: [] }, () => {
            this.setState({ posts: res.data, newPost: "" });
          });
        });
      });
    }
  };

  handleClick = (e, i) => {
    const { posts } = this.state;
    if (posts[i].isInvert) delete posts[i].isInvert;
    else posts[i].isInvert = true;
    this.setState(this.state.posts);
    console.log(this.state);
  };
  render() {
    const { classes } = this.props;
    const { posts } = this.state;
    dayjs.extend(relativeTime);
    return (
      <Grid container className={classes.grid}>
        <Grid item sm={1} md={2}></Grid>
        <Grid item sm={10} md={8}>
          {posts ? (
            posts.map((post, i) => {
              let cardlayout;
              let cardColor = {};
              if (post.isInvert) {
                cardColor = { backgroundColor: "#3a0d82" };
                cardlayout = (
                  <>
                    <CardContent className={classes.content}>
                      <Typography variant="body1" style={{ color: "white" }}>
                        {post.userCreatedAt
                          ? `${post.username} created ${dayjs(
                              post.userCreatedAt
                            ).fromNow()}`
                          : "None"}
                      </Typography>
                    </CardContent>
                  </>
                );
              } else
                cardlayout = (
                  <>
                    <CardHeader
                      avatar={
                        <Avatar
                          className={classes.bigAvatar}
                          src={`${post.imageUrl}${post.username}`}
                        />
                      }
                      title={`@${post.username}`}
                      subheader={dayjs(post.createdAt).fromNow()}
                    />
                    <CardContent>
                      <Typography variant="body1" color="secondary">
                        {post.body}
                      </Typography>
                    </CardContent>
                  </>
                );
              return (
                <Card
                  className={classes.card}
                  key={i}
                  style={cardColor}
                  onClick={e => this.handleClick(e, i)}
                >
                  {cardlayout}
                </Card>
              );
            })
          ) : (
            <CircularProgress className={classes.loading} size={30} />
          )}
          <AuthContext.Consumer>
            {user => {
              if (user) {
                return (
                  <form noValidate onSubmit={e => this.handleSubmit(e, user)}>
                    <TextField
                      className={classes.textField}
                      type="text"
                      name="newPost"
                      placeholder="What's on your mind?"
                      fullWidth
                      multiline
                      onChange={this.handleChange}
                      value={this.state.newPost}
                    />
                    <Button variant="contained" color="secondary" type="submit">
                      <SendIcon />
                    </Button>
                  </form>
                );
              }
            }}
          </AuthContext.Consumer>
        </Grid>
        <Grid item sm={1} md={2}></Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
