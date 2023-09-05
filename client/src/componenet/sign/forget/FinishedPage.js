import { Button, Result } from 'antd';
import Link from 'antd/es/typography/Link';
const App = () => (
  <Result
    status="success"
    title="Successfully Updated!!"
    subTitle="Use this password whenever you tried to sign in"
    extra={[
      <Button type="primary" key="console">
         <Link href='/sign/signIn' style={{color:"whitesmoke"}}>Sign in</Link>
      </Button>
    ]}
  />
);
export default App;