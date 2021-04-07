import * as express from 'express';
import * as bodyParser from 'body-parser';
import {sendMessage} from './sendMessage';
import {UserBrowserSessionManager} from "./sessions/UserBrowserSessionManager";
import {registerGracefulShutdown} from "./utils/registerGracefulShutdown";


const port = process.env.PORT || 3000;

const sessions = new UserBrowserSessionManager();

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/send", async (req, res) => {
  const { name, message } = req.query;
  const session = sessions.getSession('sebastian-nemeth');
  const data = await sendMessage(session, name as string, message as string);
  await session.persist();
  return res.json({ data });
});

registerGracefulShutdown(async () => {
  console.log('Closing open Sessions...');
  await sessions.close();
})

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);