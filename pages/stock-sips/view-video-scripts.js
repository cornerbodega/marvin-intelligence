import { useState, useEffect } from "react";
import Link from "next/link";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../../utils/supabase";

const supabase = getSupabase();

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = await getSession(context.req, context.res);
    const userId = session?.user.sub;

    return {
      props: { userId },
    };
  },
});

export default function ViewVideoScripts({ userId }) {
  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    async function fetchScripts() {
      const { data, error } = await supabase
        .from("youtubeScripts")
        .select("*")
        .eq("userId", userId);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setScripts(data);
    }

    fetchScripts();
  }, [userId]);

  return (
    <div>
      <h1>Video Scripts</h1>
      {scripts.map((script, index) => (
        <div key={index}>
          <Link href={`/stock-sips/detail/${script.scriptId}`} passHref>
            <h2>{script.episodeName}</h2>
            {/* Add more details as needed */}
          </Link>
        </div>
      ))}
    </div>
  );
}
