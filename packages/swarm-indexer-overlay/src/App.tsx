import React from "react";
import { bridge, FileInfo } from "./bridge";
import filesize from "filesize";
import loader from "./icons/loader.svg";
import upload from "./icons/upload.svg";
import mimeVideo from "./mime-video.json";

interface Props {}

interface State {
  file: FileInfo | null;
  uploading: boolean;
  done: boolean;
  error: string | null;

  title: string;
  description: string;
  thumbnailUrl: string;
  channelName: string;
  channelIconUrl: string;
}

class App extends React.Component<Props, State> {
  constructor(p: Props) {
    super(p);

    this.state = {
      file: null,
      uploading: false,
      done: false,
      error: null,
      title: "",
      description: "",
      thumbnailUrl: "",
      channelName: "",
      channelIconUrl: "",
    };

    bridge.onFile((file) => this.setState({ file }));
  }

  onUploadHandler = () => {
    this.setState({ uploading: true });
    bridge
      .upload({
        title: this.state.title,
        description: this.state.description,
        thumbnailUrl: this.state.thumbnailUrl,
        channelName: this.state.channelName,
        channelIconUrl: this.state.channelIconUrl,
      })
      .then((x) => this.setState({ uploading: false, done: true }))
      .catch((err) =>
        this.setState({ uploading: false, error: err, done: false })
      );
  };

  render() {
    const { file, uploading } = this.state;
    const s = this.state;

    if (!file) return null;

    return (
      <div className="container">
        <header>
          <h1>Swarm Indexer</h1>
          <p>
            Add metadata for your file to make it visible in the Swarm Search.
          </p>
        </header>

        <section>
          <ul className="fileinfo">
            <li>
              <span>Filename:</span> {file.name}
            </li>
            <li>
              <span>Size:</span> {filesize(file.size)}
            </li>
            <li>
              <span>Type:</span> {file.type}
            </li>
          </ul>

          <input
            type="text"
            placeholder="Title"
            value={s.title}
            onChange={(e) =>
              this.setState({ title: e.target.value, done: false, error: null })
            }
          ></input>

          <input
            type="textarea"
            placeholder="Description"
            value={s.description}
            onChange={(e) =>
              this.setState({
                description: e.target.value,
                done: false,
                error: null,
              })
            }
          ></input>

          {mimeVideo.indexOf(file.type) !== -1 ? (
            <>
              <input
                type="url"
                placeholder="Thumbnail URL"
                value={s.thumbnailUrl}
                onChange={(e) =>
                  this.setState({
                    thumbnailUrl: e.target.value,
                    done: false,
                    error: null,
                  })
                }
              ></input>
              <input
                type="url"
                placeholder="Channel Icon URL"
                value={s.channelIconUrl}
                onChange={(e) =>
                  this.setState({
                    channelIconUrl: e.target.value,
                    done: false,
                    error: null,
                  })
                }
              ></input>
              <input
                type="text"
                placeholder="Channel Name"
                value={s.channelName}
                onChange={(e) =>
                  this.setState({
                    channelName: e.target.value,
                    done: false,
                    error: null,
                  })
                }
              ></input>
            </>
          ) : null}

          {!s.done ? (
            !uploading ? (
              <button onClick={this.onUploadHandler}>
                <img src={upload} width="24" height="24" />
                <span>Add to the Swarm Search</span>
                <span style={{ width: "24px" }}></span>
              </button>
            ) : (
              <button onClick={this.onUploadHandler}>
                <img src={loader} width="24" height="24" />
                <span>Uploading...</span>
                <span style={{ width: "24px" }}></span>
              </button>
            )
          ) : null}

          {s.done ? <div className="message">Done</div> : null}

          {s.error ? <div className="message error">{s.error}</div> : null}

        </section>

        <footer>
          <div>
            Powered by{" "}
            <a href="https://dapplets.org" target="_blank">
              Dapplets
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
