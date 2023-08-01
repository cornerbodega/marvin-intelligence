import LogInComponent from "../../src/components/auth/LogInComponent";

function LogIn() {
  return <LogInComponent></LogInComponent>;
  // if (!session) {
  // } else {
  //   return <div>Logged in! {JSON.stringify(session)}</div>;
  // }
  // return <></>;
  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // if (!session) {
  //   return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  // } else {
  //   return <div>Logged in!</div>;
  // }
  // <div>

  //     <Row className="text-primary">
  //       <h5 className="mb-3 mt-3">Log In</h5>
  //       <Col>

  //       </Col>
  //     </Row>

  //   </div>
}

export default LogIn;
